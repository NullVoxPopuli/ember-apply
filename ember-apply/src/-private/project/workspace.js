// @ts-check

import { getPackages } from '@manypkg/get-packages';

/**
 * Crawls up directories (until the git root) to find the directory
 * that declares which sub-directories are workspaces.
 *
 * @param {string} [cwd] directory to start the search in. defaults to process.cwd();
 */
export async function workspaceRoot(cwd = process.cwd()) {
  const { rootDir } = await getPackages(cwd);

  return rootDir;
}

/**
 * Returns a list of workspace packages in the monorepo.
 *
 * Supports:
 * - yarn workspaces
 * - pnpm workspaces
 * - npm workspaces
 *
 * @param {string} [cwd] directory to start the search in. defaults to process.cwd();
 * @returns {Promise<string[]>} list of workspaces
 */
export async function getWorkspaces(cwd = process.cwd()) {
  const { rootPackage, packages } = await getPackages(cwd);

  const dirs = packages.map((pkg) => pkg.dir);

  // In non-monorepo projects, the root package is the only package.
  // In monorepos, manypkg reports it separately from the workspace packages.
  if (rootPackage && !dirs.includes(rootPackage.dir)) {
    dirs.unshift(rootPackage.dir);
  }

  return dirs;
}

/**
 * Package discovery crawls the disk, and callers of `getRelevantPackageJson`
 * tend to look up many files under the same directory (e.g. once per linted
 * file), so discovery results are cached per starting directory.
 *
 * The pending promise is cached (rather than its result) so that concurrent
 * lookups share a single discovery.
 *
 * @type {Map<string, ReturnType<typeof getPackages>>}
 */
const packageDiscoveryCache = new Map();

/**
 * Given a file path, returns the `packageJson` of the package that most
 * relevantly contains the file.
 *
 * This is useful for finding which package a file belongs to in a monorepo,
 * without hitting the disk on every lookup: the workspace packages are
 * discovered once per `cwd` and cached for subsequent lookups.
 *
 * @example
 * ```js
 * import { project } from 'ember-apply';
 *
 * const pkgJson = await project.getRelevantPackageJson('/path/to/file.js');
 * ```
 *
 * @param {string} filePath absolute path to a file
 * @param {string} [cwd] directory to discover packages from. defaults to process.cwd();
 * @returns {Promise<Record<string, any> | null>} the packageJson of the most relevant package, or null if none found
 */
export async function getRelevantPackageJson(filePath, cwd = process.cwd()) {
  let discovery = packageDiscoveryCache.get(cwd);

  if (!discovery) {
    discovery = getPackages(cwd);
    packageDiscoveryCache.set(cwd, discovery);
  }

  const { rootPackage, packages } = await discovery;

  // The root package is a valid owner, too -- for files in the monorepo,
  // but not in any (nested) workspace package.
  const candidates = rootPackage ? packages.concat([rootPackage]) : packages;

  return findRelevantPackage(filePath, candidates)?.packageJson ?? null;
}

/**
 * @param {string} filePath - absolute path to a file
 * @param {Array<{dir: string, packageJson: Record<string, any>}>} packages - array of packages with dir and packageJson
 */
function findRelevantPackage(filePath, packages) {
  /**
   * If the cheapest, fastest path gives us one result, we can skip the complicated code
   * for finding which package belongs to a file
   *
   * (this is all so we don't need to hit the disk and cause I/O delays for every linted file)
   */
  const candidates = packages.filter((pkg) => filePath.startsWith(pkg.dir));

  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  // Find the package with the longest matching path
  // (since project directories can nest)

  /**
   * We can have multiple candidates when project directories nest
   * e.g.:
   *   - foo/
   *       package.json
   *   - foo/tests/
   *       package.json
   *
   *   If we have a file in foo/tests, we don't want to match foo,
   *   but it will match in the above.
   *
   * We also run in to this situation when we have similarly named projects:
   * e.g.:
   *   - foo/
   *   - foo-other/
   *
   *   If we have a file in foo-other, foo will also match
   */
  let bestMatch = null;
  const fParts = filePath.split('/');

  findBestCandidate: for (const pkg of candidates) {
    const candidateParts = pkg.dir.split('/');

    /**
     * If the candidate project has a longer path than our file,
     * our file cannot possibly be within that project
     */
    if (candidateParts.length > fParts.length) {
      continue;
    }

    for (let i = 0; i < candidateParts.length; i++) {
      const cPart = candidateParts[i];
      const fPart = fParts[i];

      /**
       * If a folder/segment of the candidate ever does not match
       * the filePath part, the whole candidate is not worth checking
       */
      if (cPart !== fPart) {
        continue findBestCandidate;
      }
    }

    /**
     * If execution makes it past the above loop, the *entire* candidate path is within
     * the file path.
     *
     * If we make it here, we know that we don't have a situation like "foo" vs "foo-other"
     */
    if (!bestMatch || bestMatch.dir.length < pkg.dir.length) {
      bestMatch = pkg;
    }
  }

  return bestMatch;
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
