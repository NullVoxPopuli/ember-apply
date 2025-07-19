#!/usr/bin/env node
// @ts-check
// To use with https loader
//
// ❯ node --experimental-loader ../../NullVoxPopuli/ember-apply/packages/ember-apply/src/cli/node-https-loader.js ../../NullVoxPopuli/ember-apply/packages/ember-apply/src/cli/index.js --verbose tailwind
import assert from 'assert';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { spinner } from './progress.js';
import { resolveApplyable, resolvePackageInfo } from './resolve.js';

/**
 * @typedef {import('./types').Options} Options
 */

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
      let args = Object.freeze(argv);

      assert(args.name, 'name is required');

      if (args.verbose) {
        console.info(chalk.gray(`Detected CWD: ${process.cwd()}`));
      }

      try {
        await run(args);
      } catch (/** @type any */ e) {
        spinner.fail(e.message);
        console.error(e);
      }
    },
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
async function run(options) {
  spinner.start(`Locating feature: ${options.name}`);

  const applyable = await getApplyable(options);

  assert(
    applyable,
    'Could not find an applyable feature. Does it have a default export?',
  );
  assert(typeof applyable === 'function', 'applyable must be a function');

  spinner.text = `Applying: ${options.name}`;
  spinner.info();

  await showInfo(options.name);
  await applyable();

  spinner.succeed(`Applied feature: ${options.name}`);
}

/**
 * @param {Options} options
 *
 */
async function getApplyable(options) {
  let applyableModule = await resolveApplyable(options);

  assert(
    typeof applyableModule === 'object',
    `applyable feature must be a object. got: ${typeof applyableModule}`,
  );
  assert(applyableModule, 'Could not find an applyable feature.');
  assert(
    'default' in applyableModule,
    'Module found, but it does not have a default export',
  );

  return applyableModule.default;
}

/**
 * @param {string | undefined} name
 */
async function showInfo(name) {
  if (!name) return;

  let info = await resolvePackageInfo(name);

  if (!info) return;

  let report = info.url ? `at ${info.url}` : 'to the author.';
  let message = `If there are any bugs with this applyable, feel free to report ${report}`;

  spinner.text = message;
  spinner.info();
}
