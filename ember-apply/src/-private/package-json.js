// @ts-check
import path from 'path';
import fse from 'fs-extra';

import { satisfies } from './semver-satisfies.js';

/**
 * Check if a package has a dependency in either devDependencies or dependencies
 *
 * @param {string} name the name of the package to check for
 * @param {string} [version] optional version to check for, defaults to any version
 */
export async function hasDependency(name, version = '*') {
  let packageJson = await read();

  let { dependencies = {}, devDependencies = {} } = packageJson;

  let packageVersion = dependencies[name] || devDependencies[name];

  if (!packageVersion) {
    return false;
  }

  return satisfies(packageVersion, version);
}

/**
 * Add `devDependencies` to the `package.json`.
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.addDevDependencies({
 *   autoprefixer: '^10.0.0',
 *   tailwindcss: '^3.0.0',
 * })
 * ```
 *
 *
 * @param {Record<string, string>} packages map of package names to package versions
 */
export async function addDevDependencies(packages) {
  await modify((json) => {
    json.devDependencies = { ...json.devDependencies, ...packages };
  });
}

/**
 * Add `dependencies` to the `package.json`.
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.addDependencies({
 *   tailwindcss: '^3.0.0',
 * })
 * ```
 *
 *
 * @param {Record<string, string>} packages map of package names to package versions
 */
export async function addDependencies(packages) {
  await modify((json) => {
    json.dependencies = { ...json.dependencies, ...packages };
  });
}

/**
 * Add `peerDependencies` to the `package.json`.
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.addPeerDependencies({
 *   tailwindcss: '^3.0.0',
 * });
 * ```
 *
 * @param {Record<string, string>} packages map of package names to package versions
 */
export async function addPeerDependencies(packages) {
  await modify((json) => {
    json.peerDependencies = { ...json.peerDependencies, ...packages };
  });
}

/**
 * Adds a script entry to package.json
 * If there is an existing script with the same name, it will be overwritten.
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.addScript('say:hi', 'echo "hi"');
 * ```
 *
 * @param {string} name the name of the script
 * @param {string} command the command to run
 */
export async function addScript(name, command) {
  await addScripts({ [name]: command });
}

/**
 * Adds multiple scripts to package.json.
 * If there is an existing script with a name provided to `addScripts`, it will be replaced.
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.addScripts({
 *   build: "rollup -c",
 *   build:types: "tsc --build",
 * });
 * ```
 *
 * @param {Record<string, string>} scripts
 */
export async function addScripts(scripts) {
  await modify((packageJson) => {
    packageJson.scripts = { ...packageJson.scripts, ...scripts };
  });
}

/**
 * Enables modification of any part of the project's `package.json` file.
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.modify(packgeJson => {
 *   packageJson.volta = {
 *     node: '16.3.0'
 *   }
 * });
 * ```
 *
 * @param {(json: Record<string, any>) => void} callback
 */
export async function modify(callback) {
  let filePath = path.join(process.cwd(), 'package.json');
  let json = await read();

  // Mutation of the JSON!
  await callback(json);

  await fse.writeJson(filePath, json, { spaces: 2 });
}

/**
 *
 * Returns the package.json of the current project.
 * Repeated calls to this function will cause multiple accesses
 * to the file system.
 *
 * There is no way to safely cache reading the package.json file
 * when any number of tools could modify it and you always want
 * the current version of the file.
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<Record<string, any>>}
 */
export async function read(dir) {
  let filePath = path.join(dir || process.cwd(), 'package.json');

  let jsonString = (await fse.readFile(filePath)).toString();

  let result = JSON.parse(jsonString);

  return result;
}
