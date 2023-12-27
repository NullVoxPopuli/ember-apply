import fs from 'node:fs/promises';
import path from 'node:path';

import { packageJson } from 'ember-apply';
import { apply, diff, diffSummary, newEmberApp } from 'ember-apply/test-utils';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

import { default as typescript } from '../index.js';

describe('typescript', () => {
  it('default export exists', () => {
    expect(typeof typescript).toEqual('function');
  });

  describe('applying to an ember app', () => {
    it('works via CLI', async () => {
      let appLocation = await newEmberApp();

      let getManifest = () => packageJson.read(appLocation);

      // Don't currently support ember-data
      await packageJson.removeDevDependencies(['ember-data', 'ember-welcome-page'], appLocation);
      expect((await getManifest()).devDependencies).to.not.toHaveProperty('ember-data');
      expect((await getManifest()).devDependencies).to.not.toHaveProperty('ember-welcome-page');
      await execa('pnpm', ['install', '--no-frozen-lockfile'], { cwd: appLocation });

      // ember-page-title doesn't have types yet
      //   https://github.com/ember-cli/ember-page-title/pull/275
      await fs.writeFile(path.join(appLocation, 'app/templates/application.hbs'), `hello`);

      await apply(appLocation, typescript.path);
      expect((await getManifest()).scripts).to.toHaveProperty('lint:types');

      expect(await diffSummary(appLocation)).toMatchSnapshot();
      expect(
        await diff(appLocation, { ignoreVersions: true })
      ).toMatchSnapshot();

      let install = await execa('pnpm', ['install', '--no-frozen-lockfile'], { cwd: appLocation });

      expect(install.exitCode, 'pnpm install').toBe(0);

      let lintTypes = await execa('pnpm', ['lint:types'], { cwd: appLocation });

      expect(lintTypes.exitCode, 'lint:types').toBe(0);
    });
  });
});
