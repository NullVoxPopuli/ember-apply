import { describe, expect, it } from 'vitest';

import { ember } from '../src';
import { newEmberAddon, newEmberApp, newTmpDir } from '../src/test-utils';

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
    it.skip('works', async () => {
      // TODO
    });
  });
});
