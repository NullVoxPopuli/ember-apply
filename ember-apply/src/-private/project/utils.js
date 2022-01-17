// @ts-check
import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';

import { execa } from 'execa';
import { listWorkspaces as listYarnWorkspaces } from 'yarn-workspaces-list';

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
 */
export async function gitRoot() {
  let { stdout } = await execa('git', ['rev-parse', '--show-toplevel'], {
    cwd: process.cwd(),
  });

  return stdout.trim();
}

/**
 * Returns a list of workspace packages in the monorepo.
 *
 * Supports:
 * - yarn workspaces
 *
 * TODO:
 * - npm workspaces
 * - pnpm workspaces
 *
 * @returns {Promise<string[]>} list of workspaces
 */
export async function getWorkspaces() {
  const list = await listYarnWorkspaces();

  return list.map((workspace) => workspace.location);
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
 * for await (let workspace of project.eachWorkspace()) {
 *   // perform actions within this workspace
 * }
 * ```
 */
export async function eachWorkspace() {
  let current = process.cwd();
  let workspaces = await getWorkspaces();

  return {
    from: 0,
    to: workspaces.length,

    [Symbol.asyncIterator]() {
      return {
        current: this.from,
        last: this.to,

        async next() {
          let nextWorkspace = workspaces[this.current];

          try {
            process.chdir(nextWorkspace);

            if (this.current <= this.last) {
              return { done: false, value: nextWorkspace };
            } else {
              process.chdir(current);

              return { done: true };
            }
          } finally {
            process.chdir(current);
          }
        },
      };
    },
  };
}
