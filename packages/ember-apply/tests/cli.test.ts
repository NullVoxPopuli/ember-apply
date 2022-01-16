import path from 'path';
import { describe, expect, it } from 'vitest';

import { apply, diff, diffSummary, newEmberApp } from '../src/test-utils';

describe('CLI', () => {
  describe('default command', () => {
    describe('using Tailwind as an example', () => {
      it.skip('package: @ember-apply/tailwind', async () => {
        let appLocation = await newEmberApp();

        await apply(appLocation, '@ember-apply/tailwind');

        expect(await diffSummary(appLocation)).toMatchSnapshot();
        expect(await diff(appLocation)).toMatchSnapshot();
      }, 60_000);

      it('local relative path', async () => {
        let appLocation = await newEmberApp();

        await apply(appLocation, '../ember/tailwind');

        expect(await diffSummary(appLocation)).toMatchSnapshot();
        expect(await diff(appLocation)).toMatchSnapshot();
      });

      it('local relative path (with index)', async () => {
        let appLocation = await newEmberApp();

        await apply(appLocation, '../ember/tailwind/index.js');

        expect(await diffSummary(appLocation)).toMatchSnapshot();
        expect(await diff(appLocation)).toMatchSnapshot();
      });

      it('local absolute path', async () => {
        let appLocation = await newEmberApp();
        let target = path.resolve('../ember/tailwind');

        await apply(appLocation, target);

        expect(await diffSummary(appLocation)).toMatchSnapshot();
        expect(await diff(appLocation)).toMatchSnapshot();
      });

      it('local absolute path (with index)', async () => {
        let appLocation = await newEmberApp();
        let target = path.resolve('../ember/tailwind/index.js');

        await apply(appLocation, target);

        expect(await diffSummary(appLocation)).toMatchSnapshot();
        expect(await diff(appLocation)).toMatchSnapshot();
      });
    });
  });
});
