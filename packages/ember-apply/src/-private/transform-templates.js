// @ts-check
/**
 *
 *
 * @typedef {import('ember-template-recast').TransformPluginBuilder} etrPlugin
 *
 *
 */
import fs from 'fs/promises';
import recast from 'ember-template-recast';

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
