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
import jscodeshift from 'jscodeshift';
import path from 'path';

/**
 * reads a script from source and allows analysis via jscodeshift.
 * This does not write to the file afterwards.
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
 * await js.analyze('path/to/file.js', ({ root, j }) => {
 *   root
 *    .find(j.ImportDeclaration)
 *    .forEach(path => {
 *       // do some analysis on the found AST Nodes
 *     })
 *   });
 * ```
 *
 * @param {string} filePath to the file to transform
 * @param {TransformCallback} callback
 * @param {Options} [options]
 * @returns {Promise<string>} the transformed source
 */
export async function analyze(filePath, callback, options = {}) {
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

  return transformed;
}
