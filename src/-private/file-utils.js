// @ts-check

/**
 *
 * @typedef {object} CopyOptions
 * @property {string} [ source ]
 * @property {string} [ content ]
 *
 */
import fs from 'fs/promises';
import path from 'path';

/**
 * Copy the entire contents of a directory to the target location.
 * All paths will be merged / created for you.
 *
 * @param {string} folder the location of the folder to copy the contents of
 */
export async function applyFolder(folder) {
  let files = await fs.readdir(folder);

  for (let file of files) {
    let filePath = path.join(folder, file);

    await copyFileTo(file, { source: filePath });
  }
}

/**
 * Copy a file to some `destination`. In the `options` object,
 * only one of `source` or `content` is needed.
 *
 * @param {string} destination
 * @param {CopyOptions} options
 *
 */
export async function copyFileTo(destination, options = {}) {
  const { source, content } = options;

  if (source) {
    return await fs.copyFile(source, destination);
  }

  return await fs.writeFile(destination, content);
}
