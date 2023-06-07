// @ts-check
/**
 *
 * @callback TransformCallback
 * @param {CallbackApi} callbackApi
 * @return {Promise<void>} return
 *
 * @typedef {object} Options
 * @property {Parameters<JSCodeshift['withParser']>[0]} [parser]
 *
 */
import path from 'path';

import fs from 'fs/promises';

import postcss from "postcss";

/**
 *
 * @param {string} filePath to the file to transform
 * @param {TransformCallback} callback
 * @param {Options} [options]
 * @returns {Promise<string>} the transformed source
 */
export async function analyze(filePath, callback, options = {}) {
  let code = (await fs.readFile(filePath)).toString();

  let plugin = await callback();

  let processor = postcss([{
    postcssPlugin: 'postcss-ember-apply-ephemeral-plugin',
    ...plugin,
  }])

  let transformed = processor.process(code); 

  return transformed.css;
}
