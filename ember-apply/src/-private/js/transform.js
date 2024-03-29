// @ts-check
/**
 *
 * @typedef {import('jscodeshift')} JSCodeshift
 * @typedef {ReturnType<JSCodeshift>} jAST
 *
 * @typedef {object} CallbackApi
 * @property {jAST} root
 * @property {JSCodeshift} j
 *
 * @callback TransformCallback
 * @param {CallbackApi} callbackApi
 * @return {Promise<void>} return
 *
 * @typedef {object} Options
 * @property {Parameters<JSCodeshift['withParser']>[0]} [parser]
 *
 */
import fs from 'fs/promises';

import { analyze } from './analyze.js';

/**
 * reads a script from source and transforms it with jscodeshift and then writes the file.
 *
 * The https://astexplorer.net/ REPL can be used to inspect and test out how
 * to transform javascript and typescript files.
 *
 * For javascript, the `babel` parser is used.
 * For typescript, the `ts` parser is used.
 *
 * @example
 * ```js
 * import { js } from 'ember-apply';
 *
 * await js.transform('path/to/file.js', ({ root, j }) => {
 *   root
 *    .find(j.Identifier)
 *    .forEach(path => {
 *       j(path).replaceWith(
 *         j.identifier(path.node.name.split('').reverse().join(''))
 *       );
 *     })
 *   });
 * ```
 *
 * @param {string} filePath to the file to transform
 * @param {TransformCallback} callback
 * @param {Options} [options]
 * @returns {Promise<void>}
 */
export async function transform(filePath, callback, options = {}) {
  let transformed = await analyze(filePath, callback, options);

  await fs.writeFile(filePath, transformed);
}
