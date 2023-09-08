import assert from 'node:assert';

import * as git from './git.js';

export const EVERYTHING = '__EVERYTHING__';

/*
 * @type { <T>(value: T) => T }
 */
const identity = (/** @type { unknown } */ x) => x;

/**
 * Generate a massive amount of PRs on the same repo,
 * running the same codemod for each PR.
 *
 * Useful for splitting work up by CodeOwner or area of the codebase.
 *
 * @param {import('./types').MassPROptions} options
 */
export async function massPR(options) {
  let name = options.name || identity;
  let baseBranch = options.baseBranch || 'main';
  let remote = options.baseRemote || 'origin';
  let cwd = options.cwd || process.cwd();

  assert(
    options.name,
    `options.name is required so that a PR title can be generated`,
  );
  assert(
    options.description,
    `options.description is required so that a PR description can be generated`,
  );
  assert(
    options.branch,
    `options.branch is required so that branches can be created`,
  );
  assert(
    options.commit,
    `options.commit is required so that commits can have meaningful contributions to the git history`,
  );
  assert(
    options.doWork,
    `options.doWork is required so that the actual work can be done`,
  );
  assert(
    options.ensurePR,
    `options.ensurePR is required so that the PR can be created / updated`,
  );

  await setup(remote, cwd);

  let buckets = (await options.split?.()) || [EVERYTHING];

  for (let bucket of buckets) {
    let branchName = await options.branch(bucket);

    await git.switchTo(branchName, {
      cwd,
      fromBranch: `${remote}/${baseBranch}`,
    });

    // TODO:
  }
}

/**
 * @param {string} remote
 * @param {string} [cwd]
 */
async function setup(remote, cwd) {
  await git.fetchRemote(remote);

  assert(
    await git.isClean(cwd),
    `Working directory is not clean, automation may not proceed`,
  );
}
