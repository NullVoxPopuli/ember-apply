// @ts-check
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
  await modify((packageJson) => {
    packageJson.scripts = { ...packageJson.scripts, ...scripts };
  });
}

/**
 * Enables modification of any part of the project's `package.json` file.
 *
 * @example
 * ```js
 * import { project } from 'ember-apply';
 *
 * await modify(packgeJson => {
 *   packageJson.volta = {
 *     node: '16.3.0'
 *   }
 * });
 * ```
 *
 * @param {(json: Record<string, any>) => void} callback
 */
export async function modify(callback) {
  let filePath = path.join(process.cwd(), 'package.json');
  let jsonString = (await fse.readFile(filePath)).toString();
  let json = JSON.parse(jsonString);

  json = callback(json);

  await fse.writeJson(filePath, json, { spaces: 2 });
}
