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
import path from 'path';
import jscodeshift from 'jscodeshift';

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
 * @returns void
 */
export async function transform(filePath, callback, options = {}) {
  let code = (await fs.readFile(filePath)).toString();

  let j;

  if (options?.parser) {
    j = jscodeshift.withParser(options.parser);
  } else {
    if (path.extname(filePath).endsWith('ts')) {
      j = jscodeshift.withParser('ts');
    } else {
      j = jscodeshift.withParser('babel');
    }
  }

  let root = j(code);

  await callback({ root, j });

  let transformed = root.toSource();

  await fs.writeFile(filePath, transformed);
}
