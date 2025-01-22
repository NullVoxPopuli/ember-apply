import fs from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { tsconfig } from '../src';
import { newTmpDir } from '../src/test-utils';

async function createFile(
  name = 'tsconfig.json',
  contents = `{ "content": "here" }`,
) {
  let dir = await newTmpDir();
  let filePath = path.join(dir, name);

  await fs.writeFile(filePath, contents);

  return { filePath, dir };
}

describe('tsconfig', () => {
  describe('read()', () => {
    test('reads from dir', async () => {
      let { dir } = await createFile();
      let contents = await tsconfig.read(dir);

      expect(contents).toMatchInlineSnapshot(`
        {
          "content": "here",
        }
      `);
    });

    test('reads from direct path', async () => {
      let { filePath } = await createFile();
      let contents = await tsconfig.read(filePath);

      expect(contents).toMatchInlineSnapshot(`
        {
          "content": "here",
        }
      `);
    });

    test('reads from custom direct path', async () => {
      let { filePath } = await createFile('tsconfig.custom.json');
      let contents = await tsconfig.read(filePath);

      expect(filePath).toContain('tsconfig.custom.json');
      expect(contents).toMatchInlineSnapshot(`
        {
          "content": "here",
        }
      `);
    });

    test('cant find the path', async () => {
      let dir = await newTmpDir();

      await expect(
        (async () => {
          await tsconfig.read(dir);
        })(),
      ).rejects.toThrowError('ENOENT');
    });
  });

  describe('modify()', () => {
    test('writes to the file it reads to', async () => {
      let { dir } = await createFile();

      await tsconfig.modify((tsconfig) => {
        tsconfig.foo = 'bar';
      }, dir);

      expect(await tsconfig.read(dir)).toMatchInlineSnapshot(`
        {
          "content": "here",
          "foo": "bar",
        }
      `);
    });

    test('works with comments', async () => {
      let { dir } = await createFile(
        'tsconfig.json',
        `
        {
          // And crazy indentation
          "foo": "original value",
          "compilerOptions": {}
        }
      `,
      );

      await tsconfig.modify((tsconfig) => {
        tsconfig.foo = 'bar';
      }, dir);

      /**
       * Comments being stripped isn't the worst thing
       */
      expect(await tsconfig.read(dir)).toMatchInlineSnapshot(`
        {
          "compilerOptions": {},
          "foo": "bar",
        }
      `);
    });

    test('works with trailing commas', async () => {
      let { dir } = await createFile(
        'tsconfig.json',
        `
        {
          "foo": "original value",
          "compilerOptions": {},
        }
      `,
      );

      await tsconfig.modify((tsconfig) => {
        tsconfig.foo = 'bar';
      }, dir);

      /**
       * Trailing comma retained somehow
       */
      expect(await tsconfig.read(dir)).toMatchInlineSnapshot(`
        {
          "compilerOptions": {},
          "foo": "bar",
        }
      `);
    });
  });

  describe('addCompilerOptions()', () => {
    test('options are added', async () => {
      let { dir } = await createFile();

      await tsconfig.addCompilerOptions(
        {
          isolatedModules: true,
        },
        dir,
      );

      expect(await tsconfig.read(dir)).toMatchInlineSnapshot(`
        {
          "compilerOptions": {
            "isolatedModules": true,
          },
          "content": "here",
        }
      `);
    });
  });
});
