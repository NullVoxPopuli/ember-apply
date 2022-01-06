// @ts-check
import fs from 'fs/promises';
import path from 'path';
// import execa from 'execa';
import recast from 'ember-template-recast';
import jscodeshift from 'jscodeshift';

/**
 *
 * @typedef {object} CopyOptions
 * @property {string} source
 * @property {string} content
 *
 * @typedef {typeof jscodeshift} JSCodeshift;
 * @typedef {ReturnType<JSCodeshift>} jAST;
 *
 *
 * @typedef {import('ember-template-recast').TransformPluginBuilder} etrPlugin
 *
 *
 */

/**
 * Copy a file to some `destination`. In the `options` object,
 * only one of `source` or `content` is needed.
 *
 * @param {string} destination
 * @param {object} options
 *
 */
export async function copyFileTo(destination, options = {}) {
  const { source, content } = options;

  if (source) {
    return await fs.copyFile(source, destination);
  }

  return await fs.writeFile(destination, content);
}

/**
 * Transforms an ember-template file using ember-template-recast.
 * The script at the `filePath` is read, transformed via the provided
 * `plugin`, and then written back to the same file.
 *
 * @param {string} filePath to the file to transform
 * @param {etrPlugin} plugin
 */
export async function transformTemplate(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();
  let transformed = recast.transform(code, plugin);

  await fs.writeFile(filePath, transformed.code);
}

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

/**
 * Adds an entry to the project's .gitignore file.
 *
 * @param {string} pattern the pattern to add to the .gitignore file
 * @param {string} [heading] optional heading to place the `pattern` under
 */
export function gitIgnore(pattern, heading) {
  console.log('todo', pattern, heading);
  // return fs.appendFile('.gitignore', `\n${filePath}`);
}
