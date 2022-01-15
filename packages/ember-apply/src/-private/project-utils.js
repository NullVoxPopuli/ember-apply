// @ts-check
import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';

/**
 * Add `devDependencies` to the `package.json`.
 *
 * @example
 * ```js
 * import { addDevDependencies } from 'ember-apply';
 *
 * await addDevDependencies({
 *   autoprefixer: '^10.0.0',
 *   tailwindcss: '^3.0.0',
 * })
 * ```
 *
 *
 * @param {Record<string, string>} packages map of package names to package versions
 */
export async function addDevDependencies(packages) {
  let filePath = path.join(process.cwd(), 'package.json');
  let jsonString = (await fse.readFile(filePath)).toString();
  let json = JSON.parse(jsonString);

  json.devDependencies = { ...json.devDependencies, ...packages };

  await fse.writeJson(filePath, json, { spaces: 2 });
}

/**
 * Adds a script entry to package.json
 * If there is an existing script with the same name, it will be overwritten.
 *
 * @exampl
 * ```js
 * import { addScript } from 'ember-apply';
 *
 * await addScript('say:hi', 'echo "hi"');
 * ```
 *
 * @param {string} name the name of the script
 * @param {string} command the command to run
 */
export async function addScript(name, command) {
  await addScripts({ [name]: command });
}

/**
 * Adds multiple scripts to package.json.
 * If there is an existing script with a name provided to `addScripts`, it will be replaced.
 *
 * @example
 * ```js
 * import { addScripts } from 'ember-apply';
 *
 * await addScripts({
 *   build: "rollup -c",
 *   build:types: "tsc --build",
 * });
 * ```
 *
 * @param {Record<string, string>} scripts
 */
export async function addScripts(scripts) {
  let filePath = path.join(process.cwd(), 'package.json');
  let jsonString = (await fse.readFile(filePath)).toString();
  let json = JSON.parse(jsonString);

  json.scripts = { ...json.scripts, ...scripts };

  await fse.writeJson(filePath, json, { spaces: 2 });
}

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
