import { packageJson } from 'ember-apply';
import { apply, newEmberApp, newMonorepo, readAllPackageJson } from 'ember-apply/test-utils';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

import { default as volta } from './index.js';

describe('volta', () => {
  it('default export exists', () => {
    expect(typeof volta).toEqual('function');
  });

  describe('applying to an ember app', () => {
    it('works via CLI', async () => {
      let appLocation = await newEmberApp();

      await execa('pnpm', ['install'], { cwd: appLocation });

      let manifest = await packageJson.read(appLocation);

      expect(manifest.volta).toBeUndefined();

      await apply(appLocation, volta.path);

      manifest = await packageJson.read(appLocation);

      expect(manifest.volta).not.toBeUndefined();
      expect(manifest.volta.node).toBeTypeOf('string');
    });

    it('handles pre-existing volta version', async () => {
      let appLocation = await newEmberApp();

      await packageJson.modify((json) => {
        json.volta = { node: '16.17.0' };
      }, appLocation);

      await execa('pnpm', ['install'], { cwd: appLocation });

      let manifest = await packageJson.read(appLocation);

      expect(manifest.volta).not.toBeUndefined();
      expect(manifest.volta.node).toBe('16.17.0');

      await apply(appLocation, volta.path);

      manifest = await packageJson.read(appLocation);

      expect(manifest.volta).not.toBeUndefined();
      expect(manifest.volta.node).toBe('16.17.0');
    });
  });

  describe('applying over a monorepo', () => {
    it('works via CLI', async () => {
      let root = await newMonorepo(['foo', 'bar', 'nested/baz']);

      await execa('pnpm', ['install'], { cwd: root });

      expect((await readAllPackageJson(root)).map(m => m.volta).filter(Boolean)).to.deep.equal([]);

      await apply(root, volta.path);

      let [rootManifest, ...others] = (await readAllPackageJson(root)).map(m => m.volta).filter(Boolean);

      expect(others).to.deep.equal([
        { 'extends': '../package.json' },
        { 'extends': '../package.json' },
        { 'extends': '../../package.json' },
      ]);
      // this can change frequently
      expect(rootManifest.node).toBeTypeOf('string');
    });
  });
});
