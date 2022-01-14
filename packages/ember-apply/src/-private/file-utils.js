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
 * @param {string} [to] sub folder within the target project to copy the contents to
 */
export async function applyFolder(folder, to) {
  let files = await fs.readdir(folder);

  for (let file of files) {
    let filePath = path.join(folder, file);
    let targetPath = to ? path.join(to, file) : file;
    let directory = path.dirname(targetPath);

    if (directory) {
      await fs.mkdir(directory, { recursive: true });
    }

    await copyFileTo(targetPath, { source: filePath });
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

  if (content) {
    return await fs.writeFile(destination, content);
  }

  throw new Error(`copyFileTo requires either a source or content option`);
}
