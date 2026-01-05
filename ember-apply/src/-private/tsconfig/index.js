import { join } from 'node:path';

import fse from 'fs-extra';
import JSON5 from 'json5';
import * as prettier from 'prettier';

/**
 * Reads the tsconfig.json at the passed directory
 * Only the directory is needed, but if a json path is specified, that will be read directly.
 * By default the current directory is used.
 *
 * @example
 * ```js
 * import { tsconfig } from 'ember-apply';
 *
 * await read()
 * await read('../path/elsewhere')
 * await read('../path/elsewhere/tsconfig.tests.json')
 * ```
 *
 * @param {string} [ path ] the directory of a tsconfig.json or the direct filePath to a specific tsconfig.json. The default value is the current working directory.
 * @returns {Promise<import('./types.ts').TSConfig>}
 */
export async function read(path = '.') {
  let filePath = pathFor(path);
  let jsonString = (await fse.readFile(filePath)).toString();

  let result = JSON5.parse(jsonString);

  return result;
}

/**
 * Internal function for determining where the tsconfig is
 *
 * @param {string} path
 */
function pathFor(path) {
  let filePath;
  let maybeJson = path.endsWith('.json');

  if (maybeJson) {
    filePath = path;
  } else {
    filePath = join(path || process.cwd(), 'tsconfig.json');
  }

  return filePath;
}

/**
 * Enables modification of any part of the project's `tsconfig.json` file.
 *
 * @example
 * ```js
 * import { tsconfig } from 'ember-apply';
 *
 * await tsconfig.modify(tsconfig => {
 *   tsconfig.compilerOptions ||= {};
 *   tsconfig.compilerOptions.isolatedModules = true;
 * });
 * ```
 *
 * @param {(json: Record<string, any>) => void | Promise<void>} callback
 * @param {string} [ path ] the directory of a tsconfig.json or the direct filePath to a specific tsconfig.json. The default value is the current working directory.
 */
export async function modify(callback, path = '.') {
  let filePath = pathFor(path);
  let tsconfig = await read(filePath);

  // Mutation of the JSON!
  await callback(tsconfig);

  let jsonString = JSON5.stringify(tsconfig, {
    space: '  ',
    quote: '"',
  });

  let fixed = await prettier.format(jsonString, {
    parser: 'jsonc',
    quoteProps: 'consistent',
  });

  await fse.writeFile(filePath, fixed);
}

/**
 *
 * Modifies the compilerOptions in a tsconfig.json file.
 *
 * @example
 * ```js
 * import { tsconfig } from 'ember-apply';
 *
 * await tsconfig.addCompilerOptions({
 *   isolatedDeclarations: true,
 *   isolatedModules: true,
 * });
 * ```
 *
 * @param {object} compilerOptions an object of compilerOptions to merge in with the existing compilerOptions
 * @param {string} [ path ] the directory of a tsconfig.json or the direct filePath to a specific tsconfig.json. The default value is the current working directory.
 */
export async function addCompilerOptions(compilerOptions, path = '.') {
  await modify((tsconfig) => {
    tsconfig.compilerOptions ||= {};
    Object.assign(tsconfig.compilerOptions, compilerOptions);
  }, path);
}
