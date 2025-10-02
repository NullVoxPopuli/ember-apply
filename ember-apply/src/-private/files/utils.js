// @ts-check

/**
 *
 * @typedef {object} CopyOptions
 * @property {string} [source] the source file path to copy
 * @property {string} [content] the content to copy
 *
 */
import { lstatSync } from 'node:fs';

import fs, { readFile, writeFile } from 'fs/promises';
import path from 'path';

/**
 * Copy the entire contents of a directory to the target location.
 * All paths will be merged / created for you.
 *
 * @example
 * if this script is located as a sibling to the "files" directory,
 * this will copy each file in the "files" directory to the process.cwd() directory.
 * ```js
 * import { files } from 'ember-apply';
 *
 * await files.applyFolder(path.resolve(__dirname, 'files'));
 * ```
 *
 * @example
 * if this script is located as a sibling to the "files" directory,
 * this will copy each file in the "files" directory to the `${process.cwd()}/target/subfolder` directory.
 *
 * ```js
 * import { files } from 'ember-apply';
 *
 * await files.applyFolder(path.resolve(__dirname, 'files'), 'target/subfolder');
 * ```
 *
 *
 * @param {string} folder the location of the folder to copy the contents of
 * @param {string | { to?: string, transform?: (data: { filePath: string, contents: string }) => string | Promise<string>}} [options] sub folder within the target project to copy the contents to
 */
export async function applyFolder(folder, options) {
  let files = await fs.readdir(folder);
  let to;
  let transform;

  if (typeof options === 'object') {
    to = options.to;
    transform = options.transform;
  } else {
    to = options;
  }

  for (let file of files) {
    let filePath = path.join(folder, file);
    let targetPath = to ? path.join(to, file) : file;
    let directory = path.dirname(targetPath);

    if (directory) {
      await fs.mkdir(directory, { recursive: true });
    }

    let stat = lstatSync(filePath);

    if (stat.isDirectory()) {
      await applyFolder(filePath, {
        to: targetPath,
        transform,
      });

      continue;
    }

    if (transform) {
      let buffer = await readFile(filePath);
      let contents = buffer.toString();
      let different = await transform({ filePath, contents });

      await writeFile(targetPath, different);
    } else {
      await copyFileTo(targetPath, { source: filePath });
    }
  }
}

/**
 * Copy a file to some `destination`. In the `options` object,
 * only one of `source` or `content` is needed.
 *
 * @example
 * ```js
 * import { files } from 'ember-apply';
 *
 * await files.copyFileTo('destination/file.js', { source: 'source/file.js' });
 * ```
 *
 * @example
 * ```js
 * import { files } from 'ember-apply';
 *
 * await files.copyFileTo('destination/file.js', { content: 'file contents' });
 * ```
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
