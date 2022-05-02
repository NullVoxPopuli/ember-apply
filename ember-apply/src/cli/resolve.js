import fs from 'fs/promises';
import assert from 'assert';
import os from 'os';
import path from 'path';

import pacote from 'pacote';
import { execa } from 'execa';
import chalk from 'chalk';

import { spinner } from './progress.js';
import { isInvalidPackageName, urlFor } from './package.js';

const PACKAGE_INFO_CACHE = new Map();
const PATH_CACHE = new Map();
const NPM_CACHE = new Map();

/**
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').UnknownModule} UnknownModule
 */

/**
 * @param {Options} options
 * @returns {Promise<undefined | { default?: any }>}
 */
export async function resolveApplyable(options) {
  return (
    // Could be a local path on the file system
    (await resolvePath(options))?.module ||
    // Could be a npm package
    (await resolvePackage(options)) ||
    // Might need to be installed because skypack is not working
    // (why can't they just be a CDN?)
    (await downloadFromNpm(options))
  );
}

/**
 * If possible, returns a subset of npm/package info
 *
 * @typedef {object} ConciseInfo
 * @property {string} version
 * @property {string} url
 * @property {string} name
 *
 * @param {string} name
 */
export async function resolvePackageInfo(name) {
  if (PACKAGE_INFO_CACHE.has(name)) {
    return PACKAGE_INFO_CACHE.get(name);
  }

  /**
   * @param {string} targetPath
   * @param {number} [depth]
   * @returns {Promise<undefined | any>}
   */
  async function tryResolveLocalPackageJson(targetPath, depth = 0) {
    if (depth > 4) {
      return;
    }

    let nextTarget = path.dirname(targetPath);
    let packageJson;

    try {
      let theFile = await fs.readFile(path.join(nextTarget, 'package.json'));
      let asString = theFile.toString();

      packageJson = JSON.parse(asString);
    } catch {}

    if (!packageJson) {
      return await tryResolveLocalPackageJson(nextTarget, depth + 1);
    }

    return packageJson;
  }

  async function _cacheMissResolvePackageInfo() {
    if (isInvalidPackageName(name)) {
      // Not an npm package
      // But, can we find a package.json near by
      let localInfo = await resolvePath({ name });

      if (!localInfo.path) return;

      // I don't want to write a type for this
      // Where are my F# data providers?
      /** @type {any} */
      let packageJson = await tryResolveLocalPackageJson(localInfo.path);

      if (!packageJson) {
        return;
      }

      return {
        name: packageJson.name,
        version: packageJson.version,
        url: urlFor(packageJson),
      };
    }

    // I don't want to write a type for this
    // Where are my F# data providers?
    /** @type {any} */
    let npmInfo = (await tryNpmInfo(`@ember-apply/${name}`)) || (await tryNpmInfo(name));

    if (!npmInfo) return;

    return {
      name: npmInfo.name,
      version: npmInfo.version,
      url: urlFor(npmInfo),
    };
  }

  let result = await _cacheMissResolvePackageInfo();

  PACKAGE_INFO_CACHE.set(name, result);

  return result;
}

/**
 * This is the super slow lost-resort thing to do
 * @param {Options} options
 * @returns {Promise<undefined | { default?: any }>}
 */
async function downloadFromNpm(options) {
  let { name } = options;

  assert(name, 'name is required');

  /**
   * Checking npm for an invalid package takes time,
   * and we can skip that.
   */
  if (isInvalidPackageName(name)) {
    return;
  }

  spinner.text = `Skypack unavailable, downloading from npm`;
  spinner.info();

  let packageName =
    ((await tryNpmInfo(`@ember-apply/${name}`)) ? `@ember-apply/${name}` : null) ||
    ((await tryNpmInfo(name)) ? name : null);

  let dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ember-apply-runtime---'));

  assert(packageName, `Could not find @ember-apply/${name} or ${name} on npm`);

  await pacote.extract(packageName, dir);

  let infoBuffer = await fs.readFile(path.join(dir, 'package.json'));
  let info = JSON.parse(infoBuffer.toString());
  let main = info.exports?.import;

  assert(main, `${packageName}'s package.json does not have an exports.import`);

  try {
    spinner.start(`Installing dependencies for ${packageName}`);
    await execa('npm', ['install', '--omit', 'dev', '--force'], { cwd: dir });
  } finally {
    spinner.stop();
  }

  return await tryResolve(path.join(dir, main), options);
}

/**
 * @param {Options} options
 * @returns {Promise<undefined | { default?: any }>}
 */
async function resolvePackage(options) {
  let { name } = options;

  assert(name, 'name is required');

  /**
   * Checking the internet for an invalid package takes time,
   * and we can skip that.
   */
  if (isInvalidPackageName(name)) {
    return;
  }

  // TODO: prompt user before running this code
  //       (any package can be placed here)

  //  We cannot use Skypack until they stop trying to be clever
  //    https://github.com/skypackjs/skypack-cdn/issues/258
  //
  //   A lot more things would work if they just wouldn't build packages
  //
  // https://www.skypack.dev/view/@ember-apply/tailwind
  // import emberApplyTailwind from 'https://cdn.skypack.dev/@ember-apply/tailwind';
  return (
    // shorthand
    (await tryResolve(`https://cdn.skypack.dev/@ember-apply/${name}`, options)) ||
    // if full package is specified
    (await tryResolve(`https://cdn.skypack.dev/${name}`, options))
  );
}

/**
 * @typedef {object} LocalModuleInfo
 * @property {string | undefined} path
 * @property {UnknownModule | undefined} module
 *
 * @param {Options} options
 * @returns {Promise<LocalModuleInfo>}
 */
async function resolvePath(options) {
  let { name } = options;

  if (PATH_CACHE.has(name)) {
    return PATH_CACHE.get(name);
  }

  assert(name, 'name is required');

  let potentialLocations = [
    // local, but specified index.js
    path.resolve(name),
    // local, but without index.js
    path.resolve(name, 'index.js'),
  ].map(p => {
    // On Windows, the ESM loader requires that absolute paths must be valid file:// URLs.
    // Absolute paths (e.g. with drive letters like "C:") can lead to ERR_UNSUPPORTED_ESM_URL_SCHEME
    return p.match(/^[a-zA-Z]:/) ? `file://${p}` : p;
  });

  let resolvedModule;
  let resolvedPath;

  for (let potentialPath of potentialLocations) {
    resolvedPath = potentialPath;
    resolvedModule = await tryResolve(resolvedPath, options);

    if (resolvedModule) {
      break;
    }
  }

  let result = {
    path: resolvedPath,
    module: resolvedModule,
  };

  PATH_CACHE.set(name, result);

  return result;
}

/**
 * @param {string} url - the path to import
 * @param {Options} [options]
 * @returns {Promise<undefined | { default?: any }>}
 */
async function tryResolve(url, options = {}) {
  try {
    if (options.verbose) {
      console.info(chalk.gray(`Checking ${url}`));
    }

    let applyableModule = await import(url);

    return applyableModule;
  } catch (/** @type {any} */ error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      /**
       * If *we* make a mistake, don't swallow the error
       */
      if (!error.message.includes('ember-apply/src/cli/')) {
        throw error;
      }
    }

    if (options.verbose) {
      console.error(chalk.red(error));
    }

    return;
  }
}

/**
 * @param {string} name - package name
 * @param {Options} [options]
 */
async function tryNpmInfo(name, options = {}) {
  if (NPM_CACHE.has(name)) {
    return NPM_CACHE.get(name);
  }

  try {
    if (options.verbose) {
      console.info(chalk.gray(`NPM Info: ${name}`));
    }

    let { stdout } = await execa('npm', ['view', name, '--json']);

    let info = JSON.parse(stdout);

    NPM_CACHE.set(name, info);

    return info;
  } catch (error) {
    if (options.verbose) {
      console.error(chalk.red(error));
    }

    return;
  }
}
