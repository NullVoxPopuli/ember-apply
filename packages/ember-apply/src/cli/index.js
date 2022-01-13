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
async function resolvePackage({ name, verbose }) {
  try {
    // TODO: prompt user before running this code
    //       (any package can be placed here)


    let modulePath = `https://cdn.skypack.dev/${name}`;

    if (verbose) {
      console.info(chalk.gray(`Checking ${modulePath}`));
    }

    return await import(modulePath);
  } catch (error) {
    if (verbose) {
      console.error(chalk.red(error));
    }
  }
}

/**
 * @param {Options} options
 */
async function resolvePath({ name, verbose }) {
  let cwd = process.cwd();

  assert(name, 'name is required');

  try {
    if (name.endsWith('index.js')) {
      if (!name.startsWith('/')) {
        if (verbose) {
          console.info(chalk.gray(`Checking ${path.join(cwd, name)}`));
        }

        return await import(path.join(cwd, name));
      }

      if (verbose) {
        console.error(chalk.gray(`Checking ${name}`));
      }

      return await import(name);
    }

    if (!name.startsWith('/')) {
      if (verbose) {
        console.info(chalk.gray(`Checking ${path.join(cwd, name, 'index.js')}`));
      }

      return await import(path.join(cwd, name, 'index.js'));
    }

    if (verbose) {
      console.info(chalk.gray(`Checking ${path.join(name, 'index.js')}`));
    }

    return await import(path.join(name, 'index.js'));
  } catch (error) {
    if (verbose) {
      console.error(chalk.red(error));
    }
  }
}
