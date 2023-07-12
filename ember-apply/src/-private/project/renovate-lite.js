import assert from 'node:assert';
import path from 'node:path';

import latestVersion from 'latest-version';

import {
  modify as modifyPackageJSON,
  read as readPackageJSON,
} from '../package-json/utils.js';
import { getWorkspaces, inWorkspace, workspaceRoot } from './workspace.js';

const LATEST = 'latest';
const DEP_TYPES = ['devDependencies', 'dependencies'];

/**
 * Modifies the package.json files in your project, updating versions to what is specified in the `deps` map.
 * The dep-types can be specified, if the default of `[devDependencies, dependencies]` is not desired.
 *
 * Additionally, you may use the version `'latest'` to use the latest version published to npm.
 *
 * @typedef {object} RenovateLiteOptions
 * @property {string[]} [depTypes]
 * @property {{ [depName: string]: string | 'latest' }} deps representing an object-map of dependency names to apply to all projects in your (mono)repo.
 * @property {boolean} [silent] do not log while running
 *
 * @param {RenovateLiteOptions} options
 */
export async function renovateLite(options) {
  let { deps, depTypes = DEP_TYPES, silent } = options;

  assert(deps, 'deps must be provided');
  assert(typeof deps === 'object', 'deps must be an object');
  assert(Array.isArray(depTypes), 'depTypes must be an array');

  /** @type {Record<string, string>} */
  const resolved = {};

  for (const [depName, version] of Object.entries(deps)) {
    let resolvedVersion;

    if (version === LATEST) {
      resolvedVersion = await latestVersion(depName);
    } else {
      assert(
        typeof version === 'string',
        `version for ${depName} must either be a semver version string, or the 'latest' string`,
      );
      resolvedVersion = version;
    }

    resolved[depName] = resolvedVersion;
  }

  const root = await workspaceRoot();
  const workspaces = await getWorkspaces();

  console.info(`Running over ${workspaces.length} workspaces...`);

  for (const workspace of workspaces) {
    const relativePath = path.relative(root, workspace);

    await inWorkspace(workspace, async () => {
      const manifest = await readPackageJSON();
      const flat = new Set();

      for (const depType of DEP_TYPES) {
        Object.keys(manifest[depType] ?? {}).forEach((depName) =>
          flat.add(depName),
        );
      }

      const relevantDeps = Object.keys(resolved).filter((depName) =>
        flat.has(depName),
      );

      if (relevantDeps.length === 0) {
        return;
      }

      if (!silent) {
        console.info(`Updating ${relevantDeps.length} deps in ${relativePath}`);
      }

      await modifyPackageJSON((liveManifest) => {
        for (const dep of relevantDeps) {
          const version = resolved[dep];

          for (const depType of DEP_TYPES) {
            if (!(depType in liveManifest)) {
              continue;
            }

            if (!(dep in liveManifest[depType])) {
              continue;
            }

            liveManifest[depType][dep] = version;
          }
        }
      });
    });
  }
}
