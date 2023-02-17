// @ts-check

import { findUpMultiple } from 'find-up';

import { gitRoot } from './git.js';

const yarnLock = 'yarn.lock';
const pnpmLock = 'pnpm-lock.yaml';
const npmLock = 'package-lock.json';

/**
 *
 * returns the package manager used in the project.
 * will search up from the cwd, stopping at the git-root
 *
 * @param {string} [cwd] directory to start the search in. defaults to process.cwd();
 * @returns {Promise<'yarn'|'pnpm'|'npm'>}
 */
export async function getPackageManager(cwd = process.cwd()) {
  let lockfile = await getPackageManagerLockfile(cwd);

  if (lockfile.endsWith(pnpmLock)) return 'pnpm';
  if (lockfile.endsWith(yarnLock)) return 'yarn';
  if (lockfile.endsWith(npmLock)) return 'npm';

  throw new Error('Could not determine package manager');
}

/**
 * returns the path to the package manager's lockfile.
 * will search up from the cwd, stopping at the git-root
 *
 * @param {string} [cwd] directory to start in. defaults to process.cwd();
 * @returns {Promise<string>}
 */
export async function getPackageManagerLockfile(cwd = process.cwd()) {
  let [yarn, npm, pnpm] = await findUpMultiple([yarnLock, npmLock, pnpmLock], {
    cwd,
    stopAt: await gitRoot(cwd),
  });

  return pnpm || yarn || npm;
}
