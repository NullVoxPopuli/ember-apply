// @ts-check
import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';
// import execa from 'execa';
import recast from 'ember-template-recast';
import jscodeshift from 'jscodeshift';
import posthtml from 'posthtml';

/**
 *
 * @typedef {object} CopyOptions
 * @property {string} source
 * @property {string} content
 *
 * @typedef {typeof jscodeshift} JSCodeshift;
 * @typedef {ReturnType<JSCodeshift>} jAST;
 *
 *
 * @typedef {import('ember-template-recast').TransformPluginBuilder} etrPlugin
 *
 *
 */

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

/**
 * reads a script from source and transforms it with jscodeshift and then writes the file.
 *
 * @param {string} filePath to the file to transform
 * @param {({ root: jAST, j: JSCodeshift }) => void} callback
 * @returns void
 */
export async function transformScript(filePath, callback) {
  let code = (await fs.readFile(filePath)).toString();

  let j;

  if (path.extname(filePath).endsWith('ts')) {
    j = jscodeshift.withParser('ts');
  } else {
    j = jscodeshift.withParser('babel');
  }

  let root = j(code);

  await callback({ root, j });

  let transformed = root.toSource();

  await fs.writeFile(filePath, transformed);
}

/**
 * @param {string} filePath
 */
export async function transformHTML(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();

  let transformed = await posthtml([plugin]).process(code /*, options */);

  await fs.writeFile(filePath, transformed.html);
}

/**
 * @param {string} filePath
 * @param {string} html the HTML to inject
 * @param {AddHTMLOptions} options
 */
export async function addHTML(filePath, html, { before = '' } = {}) {
  let code = (await fs.readFile(filePath)).toString();

  if (code.includes(html)) {
    return;
  }

  await transformHTML(filePath, (tree) => {
    tree.match({ tag: 'link' }, (node) => {});
  });
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
