import fs from 'fs/promises';
import path from 'path';
import { describe, expect, test } from 'vitest';

import { ember } from '../src';
import { newEmberAddon, newEmberApp, newTmpDir } from '../src/test-utils';

let it = test.concurrent;

describe('ember', () => {
  describe(ember.isApp.name, () => {
    it('is true for apps', async () => {
      let dir = await newEmberApp();

      expect(await ember.isApp(dir)).toBe(true);
    });

    it('is false for addons', async () => {
      let dir = await newEmberAddon();

      expect(await ember.isApp(dir)).toBe(false);
    });
  });

  describe(ember.isAddon.name, () => {
    it('is false for apps', async () => {
      let dir = await newEmberApp();

      expect(await ember.isAddon(dir)).toBe(false);
    });

    it('is true for addons', async () => {
      let dir = await newEmberAddon();

      expect(await ember.isAddon(dir)).toBe(true);
    });
  });

  describe(ember.isEmberProject.name, () => {
    it('is true for apps', async () => {
      let dir = await newEmberApp();

      expect(await ember.isEmberProject(dir)).toBe(true);
    });

    it('is true for addons', async () => {
      let dir = await newEmberAddon();

      expect(await ember.isEmberProject(dir)).toBe(true);
    });

    it('is false for empty directories', async () => {
      let dir = await newTmpDir();

      expect(await ember.isEmberProject(dir)).toBe(false);
    });
  });

  describe(ember.transformTemplate.name, () => {
    it('works', async () => {
      let dir = await newTmpDir();

      let target = path.join(dir, 'file.hbs');

      await fs.writeFile(target, '<h1>Hello World</h1>');

      await ember.transformTemplate(target, (/* env */) => {
        // let b = env.syntax.builders;

        return {
          ElementNode(node) {
            node.tag = node.tag.split('').reverse().join('');
          },
        };
      });

      expect(await fs.readFile(path.join(dir, 'file.hbs'), 'utf8')).toBe('<1h>Hello World</1h>');
    });
  });
});
