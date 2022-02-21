// @ts-check
import path from 'path';
import fse from 'fs-extra';

import { satisfies } from './semver-satisfies.js';

/**
 * Check if a package has a dependency in either devDependencies or dependencies
 *
 * @param {string} name the name of the package to check for
 * @param {string} [version] optional version to check for, defaults to any version
 * @param {string} [cwd] override the working directory
 */
export async function hasDependency(name, version = '*', cwd) {
  let packageJson = await read(cwd);

  let { dependencies = {}, devDependencies = {} } = packageJson;

  let packageVersion = dependencies[name] || devDependencies[name];

  if (!packageVersion) {
    return false;
  }

  return satisfies(packageVersion, version);
}

/**
 * Check if a package has a peer dependency
 *
 * @param {string} name the name of the package to check for
 * @param {string} [version] optional version to check for, defaults to any version
 * @param {string} [cwd] override the working directory
 */
export async function hasPeerDependency(name, version = '*', cwd) {
  let packageJson = await read(cwd);

  let { peerDependencies = {} } = packageJson;

  let packageVersion = peerDependencies[name];

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
 * @param {Record<string, string>} packages map of package names to package versions
 * @param {string} [cwd] override the working directory
 */
export async function addDevDependencies(packages, cwd) {
  await modify((json) => {
    json.devDependencies = { ...json.devDependencies, ...packages };
  }, cwd);
}

/**
 * Remove `dependencies` from the `package.json`
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.removeDependencies(['autoprefixer', 'tailwindcss']);
 * ```
 *
 * @param {string[]} packages list of package to remove
 * @param {string} [cwd] override the working directory
 */
export async function removeDependencies(packages, cwd) {
  await modify((json) => {
    let deps = json.dependencies;

    for (let packageName of packages) {
      delete deps[packageName];
    }

    json.dependencies = deps;
  }, cwd);
}

/**
 * Remove `devDependencies` from the `package.json`
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.removeDevDependencies(['autoprefixer', 'tailwindcss']);
 * ```
 *
 * @param {string[]} packages list of package to remove
 * @param {string} [cwd] override the working directory
 */
export async function removeDevDependencies(packages, cwd) {
  await modify((json) => {
    let devDeps = json.devDependencies;

    for (let packageName of packages) {
      delete devDeps[packageName];
    }

    json.devDependencies = devDeps;
  }, cwd);
}

/**
 * Remove `peerDependencies` from the `package.json`
 *
 * @example
 * ```js
 * import { packageJson } from 'ember-apply';
 *
 * await packageJson.removePeerDependencies(['autoprefixer', 'tailwindcss']);
 * ```
 *
 * @param {string[]} packages list of package to remove
 * @param {string} [cwd] override the working directory
 */
export async function removePeerDependencies(packages, cwd) {
  await modify((json) => {
    let deps = json.peerDependencies;

    for (let packageName of packages) {
      delete deps[packageName];
    }

    json.peerDependencies = deps;
  }, cwd);
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
 * @param {string} [cwd] override the working directory
 */
export async function addDependencies(packages, cwd) {
  await modify((json) => {
    json.dependencies = { ...json.dependencies, ...packages };
  }, cwd);
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
 * @param {string} [cwd] override the working directory
 */
export async function addPeerDependencies(packages, cwd) {
  await modify((json) => {
    json.peerDependencies = { ...json.peerDependencies, ...packages };
  }, cwd);
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
 * @param {string} [cwd] override the working directory
 */
export async function addScript(name, command, cwd) {
  await addScripts({ [name]: command }, cwd);
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
 * @param {string} [cwd] override the working directory
 */
export async function addScripts(scripts, cwd) {
  await modify((packageJson) => {
    packageJson.scripts = { ...packageJson.scripts, ...scripts };
  }, cwd);
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
 * @param {string} [cwd] override the working directory
 */
export async function modify(callback, cwd) {
  let filePath = path.join(cwd || process.cwd(), 'package.json');
  let json = await read(cwd);

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
