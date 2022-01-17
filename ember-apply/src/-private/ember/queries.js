// @ts-check
import { read } from '../package-json/index.js';

/**
 *
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isEmberProject();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project
 */
export async function isEmberProject(dir) {
  try {
    let json = await read(dir);

    return typeof json.ember === 'object';
  } catch {
    return false;
  }
}

/**
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isApp();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project and is not an addon
 */
export async function isApp(dir) {
  let isEmber = await isEmberProject(dir);

  if (!isEmber) {
    return false;
  }

  try {
    let json = await read(dir);

    return json['ember-addon'] === undefined;
  } catch {
    return false;
  }
}

/**
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isAddon();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project and is an addon
 */
export async function isAddon(dir) {
  let isEmber = await isEmberProject(dir);

  if (!isEmber) {
    return false;
  }

  try {
    let json = await read(dir);

    return typeof json['ember-addon'] === 'object';
  } catch {
    return false;
  }
}
