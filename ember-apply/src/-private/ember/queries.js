// @ts-check
import path from 'node:path';

import { globby } from 'globby';
import Table from 'table-layout';

import { isConsoleEnabled } from '../../cli/env.js';
import { read } from '../package-json/index.js';

/**
 *
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isEmberProject();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project
 */
export async function isEmberProject(dir) {
  try {
    let json = await read(dir);

    return typeof json.ember === 'object';
  } catch {
    return false;
  }
}

/**
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isApp();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project and is not an addon
 */
export async function isApp(dir) {
  let isEmber = await isEmberProject(dir);

  if (!isEmber) {
    return false;
  }

  try {
    let json = await read(dir);

    return json['ember-addon'] === undefined;
  } catch {
    return false;
  }
}

/**
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isAddon();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project and is an addon
 */
export async function isAddon(dir) {
  let isEmber = await isEmberProject(dir);

  if (!isEmber) {
    return false;
  }

  try {
    let json = await read(dir);

    return typeof json['ember-addon'] === 'object';
  } catch {
    return false;
  }
}

/**
 * @example
 * ```js
 * import { ember } from 'ember-apply';
 *
 * await ember.isV2Addon();
 * ```
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 * @returns {Promise<boolean>} true if the project is an ember project and is a v2 addon (aka, native npm package)
 */
export async function isV2Addon(dir) {
  let isEmber = await isEmberProject(dir);

  if (!isEmber) {
    return false;
  }

  try {
    let json = await read(dir);

    if (typeof json['ember-addon'] === 'object') {
      return json['ember-addon'].version === 2;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Returns statistics about what percent of your project is ember vs JS vs HTML.
 * Ember projects are mostly JS and HTML, but folks don't often realize that
 * the code they're writing is mostly "The Platform".
 *
 * Stats include:
 * - Platform Breakdown
 *   - JS (including TS)
 *   - HTML
 *   - Ember (the parts of JS and HTML that are not native to the web)
 * - File stats
 *   - # number of files, JS, TS, HBS, GJS, GTS, HTML
 *   - # number of lines for each of the filetypes
 *     - this doesn't omit non-lines of code, because the non-code is sometimes
 *       more valuable than the code itself
 *
 *  The heuristics
 *  - JS/TS:
 *    - Anything that isn't in the following list counts as "native JS/TS", leaving what's in this list to be what makes up the "Ember" score
 *      - decorators (for now, until ember moves to spec decorators)
 *      - constructors of `@glimmer/component`
 *        - people should migrate away from constructors if they're going full Polaris Paradigms
 *      - routes
 *      - controllers
 *
 *  - HBS/HTML:
 *    - Anything that isn't in the following list counts as "native HBS/HTML", leaving what's in this list to be what makes up the "Ember" score
 *      - curlies / control flow
 *        - angle bracket components are standard accross the ecosystem so they count towards HTML
 *      - string / text nodes will be omitted from the calculation entirely as they'd be present regardless, and would make the percentages of ember vs HTML smaller (for both)
 *
 *  - GJS/GTS:
 *    - will be parsed in to their respected JS/TS vs HBS/HTML counterparts,
 *      and have the above ran on them
 *
 *
 * @param {string} [dir] optionally override the directory to read from -- defaults to the current working directory
 */
export async function stats(dir) {
  let current = dir || process.cwd();
  let isEmber = await isEmberProject(current);

  if (!isEmber) {
    throw new Error(`project is not an ember project. Checked in ${current}`);
  }

  let files = await globby('**/*.{js,ts,hbs,html,gjs,gts}', {
    cwd: current,
    gitignore: true,
  });

  /** @type {Record<string, Set<String>>} */
  let fileGroups = {
    js: new Set(),
    ts: new Set(),
    hbs: new Set(),
    html: new Set(),
    gjs: new Set(),
    gts: new Set(),
  };

  /** @type {Record<string, Set<String>>} */
  let folderGroups = {
    components: new Set(),
    routes: new Set(),
    controllers: new Set(),
    templates: new Set(),
  };

  const folders = Object.keys(folderGroups);
  /** @param {string} filePath */
  const folder = (filePath) => folders.find((f) => filePath.includes(`${f}/`));

  for (let file of files) {
    // includes the '.'
    let extName = path.extname(file);
    let ext = extName.slice(1);

    if (!(ext in fileGroups)) continue;

    fileGroups[ext].add(file);

    let relevant = folder(file);

    if (relevant) {
      folderGroups[relevant]?.add(file);
    }
  }

  if (!isConsoleEnabled()) {
    return {
      fileGroups,
      folderGroups,
    };
  }

  let fileTable = new Table(objectToArray(fileGroups), {
    maxWidth: 80,
    columns: setColumns(),
  });
  let folderTable = new Table(objectToArray(folderGroups), {
    maxWidth: 80,
    columns: setColumns(),
  });

  console.info(fileTable.toString());
  console.info(folderTable.toString());
}

/**
 * @param {Record<string, Set<unknown>>} objectOfSets
 */
function objectToArray(objectOfSets) {
  let result = [];

  for (let [key, value] of Object.entries(objectOfSets)) {
    result.push({ key, value });
  }

  return result;
}

function setColumns() {
  return [
    { name: 'key' },
    {
      name: 'value',
      /** @param {Set<unknown>} cell */
      get: (cell) => cell.size,
    },
  ];
}
