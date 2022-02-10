// @ts-check

import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import { execa } from 'execa';

import { project, js, files, packageJson } from 'ember-apply';

/**
 * @param {string} workingDirectory - the directory `npx ember-apply` was invoked fromm
 */
export default async function run(workingDirectory) {
  let info = await packageJson.read();
  let name = info.name;
  let workspace = name.split('/')[1] ?? name;

  if (info['ember-addon']?.version === 2) {
    return;
  }

  let emberCli = info.devDependencies['ember-cli'];

  /**
   * High level process
   *
   *  - Make new ember app for testing
   *  - move addon tests to that ember app
   *  - add addon name to test app
   *  - create new project at root
   *  - move addon folder to src
   *  - delete app directory
   *  - copy over enough files to the new project for it to work
   *
   */
  await fs.mkdir('testing', { recursive: true });
  await execa('npx', [`ember-cli@${emberCli}`, 'new', 'ember-app', '--skip-npm', '--skip-git']);
  await packageJson.addDevDependencies(
    {
      [name]: '*',
    },
    path.join(process.cwd(), 'testing/ember-app')
  );

  await fse.move('addon', `${workspace}/src`);

  // Delete unneeded files
  await fse.remove('app');
  await fse.remove('.ember-cli');
  await fse.remove('types');
  await fse.remove('tsconfig.json');
  await fse.remove('.npmignore');
  await fse.remove('.eslintignore');
  await fse.remove('.eslintrc.js');
  await fse.remove('.template-lintrc.js');
  await fse.remove('index.js');
  await fse.remove('testem.js');
  await fse.remove('tests/dummy');
  await fse.remove('tests/index.html');

  // Move useful files to test app
  await fse.move('ember-cli-build.js', 'testing/ember-app/');
  await fse.move('tests/*', 'testing/ember-app/tests/');
}

export function workspacePackageJsonFrom(old, workspace) {
  let rootJson = {
    private: 'true',
    workspaces: [workspace, 'testing/*'],
    repository: old.repository,
    license: old.license,
    author: old.author,
    scripts: {
      build: `yarn workspace ${workspace} build`,
      prepare: 'yarn build',
    },
  };

  if (old.volta) {
    rootJson.volta = old.volta;
  }

  if (old.engines) {
    rootJson.engines = old.engines;
  }

  return rootJson;
}

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
