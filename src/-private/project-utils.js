// @ts-check
import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';
// import execa from 'execa';

/**
 * Adds a script entry to package.json
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

  let [before, after] = fileString.split(heading);

  let newFile;

  if (!after) {
    newFile = `${heading}\n${pattern}\n${before}`;
  } else {
    newFile = `${before}\n${heading}\n${pattern}\n${after}`;
  }

  await fs.writeFile(filePath, newFile);
}
