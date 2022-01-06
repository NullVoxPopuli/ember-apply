// @ts-check
/**
 *
 * @typedef {typeof jscodeshift} JSCodeshift;
 * @typedef {ReturnType<JSCodeshift>} jAST;
 *
 */
import fs from 'fs/promises';
import path from 'path';
import jscodeshift from 'jscodeshift';

/**
 * reads a script from source and transforms it with jscodeshift and then writes the file.
 *
 * @param {string} filePath to the file to transform
 * @param {({ root: jAST, j: JSCodeshift }) => void} callback
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
