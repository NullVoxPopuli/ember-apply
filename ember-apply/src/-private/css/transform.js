// @ts-check

/**
 * @typedef {import('postcss').Plugin} Plugin
 */

import fs from 'node:fs/promises';

import { analyze } from './analyze.js';

/**
 * Given a file path to a css file, this will apply
 * a postcss plugin to transform the file, and write it back to disk.
 *
 * See [the plugin docs for postcss](https://github.com/postcss/postcss/blob/main/docs/plugins.md) for more information.
 *
 * @example
 * ```js
 * import { css } from 'ember-apply';
 *
 * await css.transform('path/to/file.css', {
 *   Once(root) {
 *     root.walkRules(rule => {
 *       rule.walkDecls(decl => {
 *         decl.prop = decl.prop.split('').reverse().join('');
 *       });
 *     });
 *   }
 * });
 * ```
 *
 * @param {string} filePath to the file to transform
 * @param {import('postcss').Plugin} plugin
 * @returns {Promise<void>}
 */
export async function transform(filePath, plugin) {
  let transformed = await analyze(filePath, plugin);

  await fs.writeFile(filePath, transformed);
}
