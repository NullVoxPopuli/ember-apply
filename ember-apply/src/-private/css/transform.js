// @ts-check

/**
  * @typedef {import('postcss').Plugin} Plugin
  */

import fs from 'fs/promises';

import postcss from "postcss";

import { analyze } from './analyze.js';

/**
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
