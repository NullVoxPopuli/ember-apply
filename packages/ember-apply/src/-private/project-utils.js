// @ts-check
import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';

/**
 * Adds an entry to the project's .gitignore file.
 * Will create a .gitignore file if it doesn't exist.
 * Will insert the `pattern` under the `heading` and create the
 * `heading` if it doesn't exist.
 *
 * @example
 * place an ignore entry at the bottom of the file
 * ```js
 * import { gitIgnore } from 'ember-apply';
 *
 * await gitIgnore('node_modules');
 * ```
 *
 * @example
 * place an ignore under a heading in the .gitignore file
 * ```js
 * import { gitIgnore } from 'ember-apply';
 *
 * await gitIgnore('dist', '# build output');
 * ```
 *
 * @param {string} pattern the pattern to add to the .gitignore file
 * @param {string} [heading] optional heading to place the `pattern` under
 */
export async function gitIgnore(pattern, heading) {
  let filePath = path.join(process.cwd(), '.gitignore');

  let hasFile = fse.existsSync(filePath);

  if (!hasFile) {
    await fs.writeFile(filePath, heading + '\n' + pattern);
  }

  let fileContents = await fs.readFile(filePath);
  let fileString = fileContents.toString();

  if (fileString.includes(pattern)) {
    return;
  }

  if (!heading) {
    await fs.writeFile(filePath, `${fileString}\n${pattern}`);

    return;
  }

  let [before, after] = fileString.split(heading);

  let newFile;

  if (!after) {
    newFile = `${heading}\n${pattern}\n${before}`;
  } else {
    newFile = `${before}\n${heading}\n${pattern}\n${after}`;
  }

  await fs.writeFile(filePath, newFile);
}
