// @ts-check

/**
 * @typedef {import('postcss').Plugin} Plugin
 */

import fs from "node:fs/promises";

import { analyze } from "./analyze.js";

/**
 *
 * @param {string} filePath to the file to transform
 * @param {import('postcss').Plugin} plugin
 * @returns {Promise<void>}
 */
export async function transform(filePath, plugin) {
  let transformed = await analyze(filePath, plugin);

  await fs.writeFile(filePath, transformed);
}
