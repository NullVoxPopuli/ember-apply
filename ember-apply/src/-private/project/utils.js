// @ts-check
import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';

import { execa } from 'execa';
import { listWorkspaces as listYarnWorkspaces } from 'yarn-workspaces-list';
import { findUp, findUpMultiple } from 'find-up';

/**
 * Adds an entry to the project's .gitignore file.
 * Will create a .gitignore file if it doesn't exist.
 * Will insert the `pattern` under the `heading` and create the
 * `heading` if it doesn't exist.
 *
 * @example
 * place an ignore entry at the bottom of the file
 * ```js
 * import { project } from 'ember-apply';
 *
 * await project.gitIgnore('node_modules');
 * ```
 *
 * @example
 * place an ignore under a heading in the .gitignore file
 * ```js
 * import { project } from 'ember-apply';
 *
 * await project.gitIgnore('dist', '# build output');
 * ```
 *
 * @param {string} pattern the pattern to add to the .gitignore file
 * @param {string} [heading] optional heading to place the `pattern` under
 */
export async function gitIgnore(pattern, heading) {
  let filePath = path.join(process.cwd(), '.gitignore');

  let hasFile = fse.existsSync(filePath);

  if (!hasFile) {
    await fs.writeFile(filePath, heading + '\n' + pattern);
  }

  let fileContents = await fs.readFile(filePath);
  let fileString = fileContents.toString();

  if (fileString.includes(pattern)) {
    return;
  }

  if (!heading) {
    await fs.writeFile(filePath, `${fileString}\n${pattern}`);

    return;
  }

  let [before, after] = fileString.split(heading);

  let newFile;

  if (!after) {
    newFile = `${heading}\n${pattern}\n${before}`;
  } else {
    newFile = `${before}\n${heading}\n${pattern}\n${after}`;
  }

  await fs.writeFile(filePath, newFile);
}

/**
 * Uses git to return the path to the root of the project.
 * This is the absolute path to the root of the project / repository.
 * Note: git for windows returns POSIX-style paths
 *
 * @param {string} [cwd] directory to start in. defaults to process.cwd();
 */
export async function gitRoot(cwd = process.cwd()) {
  let { stdout } = await execa('git', ['rev-parse', '--show-toplevel'], {
    cwd,
  });

  return path.resolve(stdout.trim());
}

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
      let { stdout } = await execa('pnpm', ['ls', '-r', '--depth', '-1', '--long', '--parseable'], {
        cwd,
      });

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
