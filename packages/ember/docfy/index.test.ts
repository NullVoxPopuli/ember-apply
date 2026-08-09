import { apply, diff, diffSummary, newEmberApp } from 'ember-apply/test-utils';
import { describe, expect, it } from 'vitest';

import { default as docfy } from './index';

describe('docfy', () => {
  it('default export exists', () => {
    expect(typeof docfy).toEqual('function');
  });

  describe('applying to an ember app', () => {
    it('works via CLI', async () => {
      let appLocation = await newEmberApp();

      await apply(appLocation, docfy.path);

      expect(await diffSummary(appLocation)).toMatchSnapshot();
      expect(await diff(appLocation, { ignoreVersions: true })).toMatchSnapshot();
    });
  });
});
