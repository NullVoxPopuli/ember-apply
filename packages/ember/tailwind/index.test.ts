import { apply, diff, diffSummary, newEmberApp } from 'ember-apply/test-utils';
import { describe, expect, it } from 'vitest';

import { default as tailwind } from './index';

describe('tailwind', () => {
  it('default export exists', () => {
    expect(typeof tailwind).toEqual('function');
  });

  describe('applying to an ember app', () => {
    it('works via CLI', async () => {
      let appLocation = await newEmberApp();

      await apply(appLocation, tailwind.path);

      expect(await diffSummary(appLocation)).toMatchSnapshot();
      expect(await diff(appLocation)).toMatchSnapshot();
    });
  });
});
