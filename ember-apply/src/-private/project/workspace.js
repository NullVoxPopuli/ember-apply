// @ts-check
import path from 'node:path';

import { execa } from 'execa';
import { listWorkspaces as listYarnWorkspaces } from 'yarn-workspaces-list';

import {
  getPackageManager,
  getPackageManagerLockfile,
} from './package-manager.js';

/**
 * Crawls up directories (until the git root) to find the directory
 * that declares which sub-directories are workspaces.
 *
 * For yarn, this is the package.json with a workspaces entry
 *
 * @param {string} [cwd] directory to start the search in. defaults to process.cwd();
 */
export async function workspaceRoot(cwd = process.cwd()) {
  let lockFile = await getPackageManagerLockfile(cwd);

  return path.dirname(lockFile);
}

/**
 * Returns a list of workspace packages in the monorepo.
 *
 * Supports:
 * - yarn workspaces
 * - pnpm workspaces
 *
 * TODO:
 * - npm workspaces
 *
 * @param {string} [cwd] directory to start the search in. defaults to process.cwd();
 * @returns {Promise<string[]>} list of workspaces
 */
export async function getWorkspaces(cwd = process.cwd()) {
  const root = await workspaceRoot(cwd);

  const packageManager = await getPackageManager(cwd);

  switch (packageManager) {
    case 'yarn': {
      const list = await listYarnWorkspaces({ cwd });

      return list.map((workspace) => path.join(root, workspace.location));
    }
    case 'pnpm': {
      /**
       * example:
       * /home/nullvoxpopuli/Development/NullVoxPopuli/ember-apply:ember-apply-monorepo:PRIVATE
       * /home/nullvoxpopuli/Development/NullVoxPopuli/ember-apply/ember-apply:ember-apply@2.5.2
       * /home/nullvoxpopuli/Development/NullVoxPopuli/ember-apply/packages/docs:docs@0.0.0:PRIVATE
       * /home/nullvoxpopuli/Development/NullVoxPopuli/ember-apply/packages/ember/embroider:@ember-apply/embroider@1.0.23
       * /home/nullvoxpopuli/Development/NullVoxPopuli/ember-apply/packages/ember/tailwind:@ember-apply/tailwind@2.0.24
       */
      let { stdout } = await execa(
        'pnpm',
        ['ls', '-r', '--depth', '-1', '--long', '--parseable'],
        {
          cwd,
        }
      );

      let lines = stdout.split('\n');

      return lines.map((line) => line.split(':')[0]);
    }
    case 'npm': {
      throw new Error('npm workspaces are not yet supported');
    }

    default: {
      throw new Error(`unknown package manager ${packageManager}`);
    }
  }
}

/**
 * allows using any of the `ember-apply` utilities under
 * the provided workspace.
 * The utilities utilize the process.cwd() to determine which
 * project to run in, so this function changes the current working
 * directory to the workspace directory so that the `ember-apply`
 * utilities can be used in the passed workspace.
 *
 * When the `callback` is finished, the current working directory
 * is restored to the original working directory.
 *
 * This can be useful for selecting specific workspaces to perform
 * operations on, and ignoring other workspaces.
 *
 * @example
 * ```js
 * import { project } from 'ember-apply';
 *
 * for (let workspace of await project.getWorkspaces()) {
 *   await project.inWorkspace(workspace, async () => {
 *     // perform actions within this workspace
 *   });
 * }
 * ```
 *
 * @param {string} workspace
 * @param {() => Promise<void>} callback
 */
export async function inWorkspace(workspace, callback) {
  let previous = process.cwd();

  try {
    process.chdir(workspace);

    await callback();
  } finally {
    process.chdir(previous);
  }
}

/**
 * Iterate over each workspace in the project.
 *
 * @example
 * ```js
 * import { project } from 'ember-apply';
 *
 * for await (let workspace of await project.eachWorkspace()) {
 *   // perform actions within this workspace
 * }
 * ```
 */
export async function eachWorkspace() {
  let originalCWD = process.cwd();
  let workspaces = await getWorkspaces();

  // The root is totally not a workspace, it's the root! we already have this path
  // (it's the directory we might be in already)
  // workspaces.filter((workspace) => workspace !== '.');

  return {
    from: 0,
    to: workspaces.length - 1,

    [Symbol.asyncIterator]() {
      return {
        current: this.from,
        last: this.to,

        async next() {
          let nextWorkspace = workspaces[this.current];

          // For when there are no workspaces
          // Or we exceed 'to'
          if (!nextWorkspace) {
            process.chdir(originalCWD);

            return { done: true };
          }

          this.current++;

          try {
            process.chdir(nextWorkspace);

            return { done: false, value: nextWorkspace };
          } catch (e) {
            console.error(e);
          }
        },
      };
    },
  };
}
