// @ts-check

/**
 * @typedef {object} AddHTMLOptions
 * @property {string} before which tag to insert text before
 */

import fs from 'fs/promises';
import posthtml from 'posthtml';

/**
 * @param {string} filePath
 */
export async function transformHTML(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();

  let transformed = await posthtml([plugin]).process(code /*, options */);

  await fs.writeFile(filePath, transformed.html);
}

/**
 * @param {string} filePath
 * @param {string} html the HTML to inject
 * @param {AddHTMLOptions} options
 */
export async function addHTML(filePath, html, { before = '' }) {
  let code = (await fs.readFile(filePath)).toString();

  if (code.includes(html)) {
    return;
  }

  await transformHTML(filePath, (tree) => {
    tree.match({ tag: 'link' }, (node) => {});
  });
}
