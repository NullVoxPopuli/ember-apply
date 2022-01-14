#!/usr/bin/env node
// @ts-check
import assert from 'assert';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';

/**
 * @typedef {object} Options
 * @property {string} [ name ]
 * @property {boolean} [ verbose ]
 *
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

process.on('uncaughtException', function (err) {
  console.error(chalk.red(err));
});

yargs(hideBin(process.argv))
  .command(
    '$0 <name>',
    'Apply a feature to the current project',
    (yargs) => {
      return yargs.positional('name', {
        describe: 'Name of the feature to apply',
        type: 'string',
      });
    },
    async (argv) => {
      /** @type {Options} */
      let args = argv;

      assert(args.name, 'name is required');

      const applyable = await getApplyable(args);

      assert(applyable, 'Could not find an applyable feature. Does it have a default export?');
      assert(typeof applyable === 'function', 'applyable must be a function');

      await applyable();
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .demandCommand(1)
  .parse();

/**
 * @param {Options} options
 *
 */
async function getApplyable(options) {
  let applyableModule = await resolveApplyable(options);

  assert(applyableModule, 'Could not find an applyable feature. Does it have a default export?');

  return applyableModule.default;
}

/**
 * @param {Options} options
 */
async function resolveApplyable(options) {
  return (
    // Could be a local path on the file system
    (await resolvePath(options)) ||
    // Could be a npm package
    (await resolvePackage(options))
  );
}

/**
 * @param {Options} options
 */
async function resolvePackage(options) {
  let { name } = options;

  // TODO: prompt user before running this code
  //       (any package can be placed here)

  // https://www.skypack.dev/view/@ember-apply/tailwind
  // import emberApplyTailwind from 'https://cdn.skypack.dev/@ember-apply/tailwind';
  return await tryResolve(`https://cdn.skypack.dev/${name}`, options);
}

/**
 * @param {Options} options
 */
async function resolvePath(options) {
  let cwd = process.cwd();
  let { name, verbose } = options;

  assert(name, 'name is required');

  return (
    // local, but specified index.js
    (await tryResolve(path.join(cwd, name), options)) ||
    // local, but without index.js
    (await tryResolve(path.join(cwd, name, 'index.js'), options)) ||
    // local, but absolute path
    (await tryResolve(path.join(name), options)) ||
    // local, but absolute path without specifying index.js
    (await tryResolve(path.join(name, 'index.js'), options))
  );
}

/**
 * @param {string} url - the path to import
 * @param {Options} [options]
 */
async function tryResolve(url, options = {}) {
  try {
    if (options.verbose) {
      console.info(chalk.gray(`Checking ${url}`));
    }

    return await import(url);
  } catch (error) {
    if (options.verbose) {
      console.error(chalk.red(error));
    }

    return;
  }
}
