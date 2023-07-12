import fs from 'node:fs/promises';
import path from 'node:path';

import { execaCommand } from 'execa';
import * as prettier from 'prettier';

import { mktmp } from './tmp.js';

/**
 * Non destructively perform a formatted diff using git to diff on words
 *
 * The underlying git command behind this is:
 *    git diff --word-diff=color --word-diff-regex=. file1 file2
 *
 *  @param {string} originalFilePath the path to the original file on disk
 *  @param {string} modifiedFilePath the path to the modified file on disk
 */
export async function formattedDiff(originalFilePath, modifiedFilePath) {
  let originalFile = await fs.readFile(originalFilePath);
  let modifiedFile = await fs.readFile(modifiedFilePath);

  let originalStr = originalFile.toString();
  let modifiedStr = modifiedFile.toString();

  let originalFormatted = await prettier.format(originalStr, {
    filepath: originalFilePath,
  });
  let modifiedFormatted = await prettier.format(modifiedStr, {
    filepath: modifiedFilePath,
  });

  let tmpDir = await mktmp();

  let formattedOriginalPath = path.join(tmpDir, path.basename(originalFilePath));
  let formattedModifiedPath = path.join(tmpDir, path.basename(modifiedFilePath));

  await fs.writeFile(formattedOriginalPath, originalFormatted);
  await fs.writeFile(formattedModifiedPath, modifiedFormatted);

  let { stdout } = await execaCommand(
    `git diff --word-diff=color --word-diff-regex=. ${formattedOriginalPath} ${formattedModifiedPath}`,
    { cwd: tmpDir }
  );

  return stdout;
}

/**
 * @param {string} originalStr the original string to diff
 * @param {string} modifiedStr the modified string to diff
 * @param {string} extension the extension to use for the tmp files, used for formatting
 *
 */
export async function formattedDiffStrings(originalStr, modifiedStr, extension) {
  let tmpDir = await mktmp('file.formatted.diff.string');

  let originalPath = path.join(tmpDir, `original.${extension}`);
  let modifiedPath = path.join(tmpDir, `modified.${extension}`);

  await fs.writeFile(originalPath, originalStr);
  await fs.writeFile(modifiedPath, modifiedStr);

  return await formattedDiff(originalPath, modifiedPath);
}
