import fs from 'node:fs/promises';
import path from 'node:path';

import { packageJson } from 'ember-apply';
import { apply, diff, diffSummary, newEmberApp } from 'ember-apply/test-utils';
import { execaCommand } from 'execa';
import { describe, expect, it } from 'vitest';

import { default as typescript } from '../index.js';

describe('typescript', () => {
  it('default export exists', () => {
    expect(typeof typescript).toEqual('function');
  });

  let appLocation: string;
  const app = {
    manifest: () => packageJson.read(appLocation),
    devDeps: async () => (await app.manifest()).devDependencies,
    scripts: async () => (await app.manifest()).scripts,
    run: (command: string) => execaCommand(command, { cwd: appLocation }),
    install: () => app.run('pnpm install --no-frozen-lockfile'),
    removeDevDep: (deps: string[]) => packageJson.removeDevDependencies(deps, appLocation),
    diff: () => diff(appLocation, { ignoreVersions: true }),
  };

  describe('applying to an ember app', () => {
    it('works via CLI', async () => {
      appLocation = await newEmberApp();


      // Don't currently support ember-data
      await app.removeDevDep(['ember-data', 'ember-welcome-page']);
      expect(await app.devDeps()).not.toHaveProperty('ember-data');
      expect(await app.devDeps()).not.toHaveProperty('ember-welcome-page');
      await app.install();

      // ember-page-title doesn't have types yet
      //   https://github.com/ember-cli/ember-page-title/pull/275
      await fs.writeFile(path.join(appLocation, 'app/templates/application.hbs'), `hello`);

      await apply(appLocation, typescript.path);

      expect(await app.scripts()).toHaveProperty('lint:types');
      expect(await app.devDeps()).not.toHaveProperty('@types/ember');
      expect(await app.devDeps()).not.toHaveProperty('@types/ember-data');
      expect((await app.install()).exitCode, 'pnpm install').toBe(0);
      expect((await app.run('pnpm lint:types')).exitCode, 'lint:types').toBe(0);

      expect(await diffSummary(appLocation)).toMatchSnapshot();
      expect(await app.diff()).toMatchSnapshot();
    });

    it('works with the default app blueprint', async () => {
      appLocation = await newEmberApp();
      await app.install();

      // ember-page-title doesn't have types yet
      //   https://github.com/ember-cli/ember-page-title/pull/275
      await fs.writeFile(path.join(appLocation, 'app/templates/application.hbs'), `hello`);

      await apply(appLocation, typescript.path);

      expect(await app.scripts()).toHaveProperty('lint:types');
      expect(await app.devDeps()).toHaveProperty('@types/ember');
      expect(await app.devDeps()).toHaveProperty('@types/ember-data');
      expect((await app.install()).exitCode, 'pnpm install').toBe(0);
      expect((await app.run('pnpm lint:types')).exitCode, 'lint:types').toBe(0);

      expect(await diffSummary(appLocation)).toMatchSnapshot();
      expect(await app.diff()).toMatchSnapshot();
    });
  });
});
