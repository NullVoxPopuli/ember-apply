#!/usr/bin/env node
// @ts-check
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async function main() {
  const [, , ...args] = process.argv;
  const [feature, ...options] = args;

  const applyable = await getApplyable(feature);

  await applyable();
})();

/**
 * TODO:
 * - read local package.json for "ember-apply" entries
 * - gracefully error when something can't be found
 * - ask to use a dependency from npm if it exists
 *
 * @param {string} name of the feature to find
 */
async function getApplyable(name) {
  try {
    const applyable = await import(
      path.join(__dirname, '..', '..', 'applyables', name, 'index.js')
    );

    return applyable.default;
  } catch (error) {
    // TODO: need verbose mode
  }

  try {
    const applyable = await import(`https://cdn.skypack.dev/${name}`);

    return applyable.default;
  } catch (error) {
    // TODO: need verbose mode
  }
}
