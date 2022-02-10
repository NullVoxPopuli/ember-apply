// @ts-check

import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import { execa } from 'execa';
import semver from 'semver';
import { globby } from 'globby';

import { packageJson } from 'ember-apply';

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

  let emberCli = semver.coerce(info.devDependencies['ember-cli']);

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
  await writeRootPackageJson(info, workingDirectory);
  await createTestApp(emberCli, name);

  await fse.move('addon', `${workspace}/src`);
  await moveTests();

  await moveFilesToTestApp();
  await removeFiles();
}

async function writeRootPackageJson(info, addonPath) {
  let rootJson = workspacePackageJsonFrom(info, addonPath);

  // root package.json must not contain 'ember-cli',
  // otherwise ember-cli doesn't work :(
  await fs.writeFile('package.json', JSON.stringify(rootJson, null, 2));
}

async function moveFilesToTestApp() {
  // Move useful files to test app
  await fse.move('ember-cli-build.js', 'testing/ember-app/ember-cli-build.js', { overwrite: true });
}

async function createTestApp(emberCli, name) {
  await fs.mkdir('testing', { recursive: true });
  await execa(
    'npx',
    [`ember-cli@${emberCli}`, 'new', 'ember-app', '--skip-npm', '--skip-git', '--embroider'],
    { cwd: path.join(process.cwd(), 'testing') }
  );
  await packageJson.addDevDependencies(
    {
      [name]: '*',
    },
    path.join(process.cwd(), 'testing/ember-app')
  );
}

async function moveTests() {
  const paths = await globby(['tests/*']);

  for (let filePath of paths) {
    await fse.move(filePath, `testing/ember-app/${filePath}`, { overwrite: true });
  }
}

async function removeFiles() {
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
}

function workspacePackageJsonFrom(old, workspace) {
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
