#!/usr/bin/env node
// @ts-check
import assert from 'assert';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async function main() {
  const [, , ...args] = process.argv;
  const [feature, ...options] = args;

  const applyable = await getApplyable(feature);

  assert(applyable, 'Could not find an applyable feature. Does it have a default export?');
  assert(typeof applyable === 'function', 'applyable must be a function');

  await applyable();
})();

/**
 * @param {string} name of the feature to find
 */
async function getApplyable(name) {
  let applyableModule;
  let cwd = process.cwd();

  /**
   * Could be a local path on the file system
   */
  try {
    if (name.endsWith('index.js')) {
      if (!name.startsWith('/')) {
        applyableModule = await import(path.join(cwd, name));
      } else {
        applyableModule = await import(name);
      }
    } else {
      if (!name.startsWith('/')) {
        applyableModule = await import(path.join(cwd, name, 'index.js'));
      } else {
        applyableModule = await import(path.join(name, 'index.js'));
      }
    }
  } catch (error) {
    console.error(error);
    // TODO: need verbose mode
  }

  /**
   * Could be a npm package
   */
  try {
    applyableModule = await import(`https://cdn.skypack.dev/${name}`);

    // TODO: prompt user before running this code
    //       (any package can be placed here)
  } catch (error) {
    // TODO: need verbose mode
  }

  return applyableModule.default;
}
