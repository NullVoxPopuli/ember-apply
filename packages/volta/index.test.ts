import { apply, newEmberApp } from 'ember-apply/test-utils';
import { packageJson } from 'ember-apply';
import { describe, expect, it } from 'vitest';

import { default as volta } from './index.js';

describe('volta', () => {
  it('default export exists', () => {
    expect(typeof volta).toEqual('function');
  });

  describe('applying to an ember app', () => {
    it('works via CLI', async () => {
      let appLocation = await newEmberApp();
      let manifest = await packageJson.read(appLocation);

      expect(manifest.volta).toBeNull();

      await apply(appLocation, volta.path);

      manifest = await packageJson.read(appLocation);

      expect(manifest.volta).not.toBeNull();
      expect(manifest.volta.node).toBeTypeOf('string');
    });
  });
});
