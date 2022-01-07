// @ts-check
/**
 *
 * @typedef {import('jscodeshift')} JSCodeshift;
 * @typedef {ReturnType<JSCodeshift>} jAST;
 *
 * @typedef {object} CallbackApi
 * @property {jAST} root
 * @property {JSCodeshift} j
 *
 * @callback TransformCallback
 * @param {CallbackApi} callbackApi
 * @return {Promise<void>} return
 *
 */
import fs from 'fs/promises';
import path from 'path';
import jscodeshift from 'jscodeshift';

/**
 * reads a script from source and transforms it with jscodeshift and then writes the file.
 *
 * @param {string} filePath to the file to transform
 * @param {TransformCallback} callback
 * @returns void
 */
export async function transformScript(filePath, callback) {
  let code = (await fs.readFile(filePath)).toString();

  let j;

  if (path.extname(filePath).endsWith('ts')) {
    j = jscodeshift.withParser('ts');
  } else {
    j = jscodeshift.withParser('babel');
  }

  let root = j(code);

  await callback({ root, j });

  let transformed = root.toSource();

  await fs.writeFile(filePath, transformed);
}
