// @ts-check
import fs from 'fs/promises';
import path from 'path';
import execa from 'execa';
import recast from 'ember-template-recast';
import jscodeshift from 'jscodeshift';

/**
 * @typedef {object} CopyOptions
 * @property {string} source
 * @property {string} content
 *
 * @description Copy a file to some destination. In the options object, only one of source or content is needed.
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
 * @typedef {import('ember-template-recast').TransformPluginBuilder} etrPlugin
 *
 * @param {string} filePath to the file to transform
 * @param {etrPlugin} plugin
 */
export async function transformTemplate(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();
  let transformed = recast.transform({ code, plugin });

  await fs.writeFile(filePath, transformed);
}

/**
 * @typedef {typeof jscodeshift} JSCodeshift;
 * @typedef {ReturnType<JSCodeshift>} jAST;
 *
 * @description reads a script from source and transforms it with jscodeshift and then writes the file.
 *
 * @param {string} source filePath to the file to transform
 * @param {({ root: jAST, j: JSCodeshift })} callback;
 * @returns void
 */
export async function transformScript(source, callback) {
  let code = (await fs.readFile(filePath)).toString();

  let j;

  if (path.extname(filePath).endsWith('ts')) {
    j = jscodeshift.withParser('ts');
  } else {
    j = jscodeshift.withParser('babel');
  }

  let root = j(code);

  let transformed = await callback({ root, j });

  if (typeof transformed !== 'string') {
    transformed = transformed.toSource();
  }

  await fs.writeFile(filePath, transformed);
}
