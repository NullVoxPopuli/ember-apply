#!/usr/bin/env node
// @ts-check
// To use with https loader
//
// ❯ node --experimental-loader ../../NullVoxPopuli/ember-apply/packages/ember-apply/src/cli/node-https-loader.js ../../NullVoxPopuli/ember-apply/packages/ember-apply/src/cli/index.js --verbose tailwind
import fs from 'fs/promises';
import assert from 'assert';
import os from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import ora from 'ora';
import pacote from 'pacote';
import { execa } from 'execa';
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
const spinner = ora();

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

      spinner.start(`Locating feature: ${args.name}`);

      const applyable = await getApplyable(args);

      assert(applyable, 'Could not find an applyable feature. Does it have a default export?');
      assert(typeof applyable === 'function', 'applyable must be a function');

      spinner.text = `Applying: ${args.name}`;
      spinner.info();
      await applyable();

      spinner.succeed(`Applied feature: ${args.name}`)
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
    (await resolvePackage(options)) ||
    // Might need to be installed because skypack is not working
    // (why can't they just be a CDN?)
    (await downloadFromNpm(options))
  );
}

/**
 * This is the super slow lost-resort thing to do
 * @param {Options} options
 */
async function downloadFromNpm(options) {
  let { name } = options;

  assert(name, 'name is required');

  spinner.text = `Skypack unavailable, downloading from npm`;
  spinner.info();

  let packageName =
    ((await tryNpmInfo(`@ember-apply/${name}`)) ? `@ember-apply/${name}` : null) ||
    ((await tryNpmInfo(name)) ? name : null);

  let dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ember-apply-runtime---'));

  assert(packageName, `Could not find @ember-apply/${name} or ${name} on npm`);

  await pacote.extract(packageName, dir);

  let infoBuffer = await fs.readFile(path.join(dir, 'package.json'));
  let info = JSON.parse(infoBuffer.toString());
  let main = info.exports?.import;

  assert(main, `${packageName}'s package.json does not have an exports.import`);

  spinner.text = `Installing dependencies for ${packageName}`;
  spinner.info();
  await execa('npm', ['install'], { cwd: dir });

  return await tryResolve(path.join(dir, main), options);
}

/**
 * @param {Options} options
 */
async function resolvePackage(options) {
  let { name } = options;

  // TODO: prompt user before running this code
  //       (any package can be placed here)

  //  We cannot use Skypack until they stop trying to be clever
  //    https://github.com/skypackjs/skypack-cdn/issues/258
  //
  //   A lot more things would work if they just wouldn't build packages
  //
  // https://www.skypack.dev/view/@ember-apply/tailwind
  // import emberApplyTailwind from 'https://cdn.skypack.dev/@ember-apply/tailwind';
  return (
    // shorthand
    (await tryResolve(`https://cdn.skypack.dev/@ember-apply/${name}`, options)) ||
    // if full package is specified
    (await tryResolve(`https://cdn.skypack.dev/${name}`, options))
  );
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

/**
 * @param {string} name - package name
 * @param {Options} [options]
 */
async function tryNpmInfo(name, options = {}) {
  let { verbose } = options;

  try {
    if (options.verbose) {
      console.info(chalk.gray(`NPM Info: ${name}`));
    }

    return await execa('npm', ['view', name]);
  } catch (error) {
    if (options.verbose) {
      console.error(chalk.red(error));
    }

    return;
  }
}
