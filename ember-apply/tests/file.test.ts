import { execa } from 'execa';
import * as fs from 'fs/promises';
import path from 'path';
import { describe, expect, test } from 'vitest';

import { files } from '../src';
import { diff, diffSummary, newTmpDir } from '../src/test-utils';

let it = test.concurrent;

describe('files', () => {
  describe('utils', () => {
    describe(files.applyFolder.name, () => {
      it('works', async () => {
        let tmpDir = await newTmpDir();

        let original = path.join(tmpDir, 'original');
        let target = path.join(tmpDir, 'target');

        await fs.mkdir(original);
        await fs.mkdir(target);

        await fs.writeFile(path.join(original, 'a.txt'), 'a');
        await execa('git', ['init'], { cwd: target });

        await files.applyFolder(path.resolve(original));

        expect(await diffSummary(target)).toMatchSnapshot();
        expect(await diff(target)).toMatchSnapshot();
      });
    });

    describe(files.copyFileTo.name, () => {
      it('copies pre-existing file', async () => {
        let tmpDir = await newTmpDir();

        await fs.writeFile(path.join(tmpDir, 'a.txt'), 'a');
        await files.copyFileTo(path.join(tmpDir, 'b.txt'), { source: path.join(tmpDir, 'a.txt') });

        expect(await fs.readFile(path.join(tmpDir, 'b.txt'), 'utf8')).toBe('a');
      });

      it('writes file contents', async () => {
        let tmpDir = await newTmpDir();

        await fs.writeFile(path.join(tmpDir, 'a.txt'), 'a');
        await files.copyFileTo(path.join(tmpDir, 'b.txt'), { content: 'b' });

        expect(await fs.readFile(path.join(tmpDir, 'b.txt'), 'utf8')).toBe('b');
      });
    });
  });
});
