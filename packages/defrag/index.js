// @ts-check
import { project } from 'ember-apply';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPackages } from '@manypkg/get-packages';
import { cosmiconfig } from 'cosmiconfig';
import semver from 'semver';
import debug from 'debug';

const d = debug('defrag');
const configExplorer = cosmiconfig('defrag');

/** @type {Map<string, Set<string>>} */
const DEPS = new Map();
/**
 * Two phase:
 *   - scan all dependencies for each workspace
 *   - apply in-range versions
 */
export default async function run() {
  const root = await project.workspaceRoot();
  const configResult = await configExplorer.search();
  const projectResult = await getPackages(root);

  /**
   * @type {import('./types').Config
   */
  const config = {
    'write-as': 'semver',
    ...(configResult?.config || {}),
  };

  d(`Resolved config:`);
  d(config);

  let manifests = [
    projectResult.rootPackage?.packageJson,
    ...projectResult.packages.map((p) => p.packageJson),
  ].filter(Boolean);

  d(`Found ${manifests.length} packages`);
  manifests.forEach((p) => p && injestDeps(p));

  console.log(DEPS);
}

/**
 * @param {import('./types').Manifest} manifest
 */
function injestDeps(manifest) {
  /**
   * @param {string} dep
   * @param {string} version
   */
  function maybeAdd(dep, version) {
    // We can't do anything about "invalid versions", so we'll ignore them.
    // These include:
    // - file/github/git/etc protocol
    // - workspaces
    // - https URLs
    if (!semver.valid(version)) {
      return;
    }

    let versions = DEPS.get(dep);
    if (!versions) {
      versions = new Set();
      DEPS.set(dep, versions);
    }

    versions.add(version);
  }

  for (let [dep, version] of Object.entries(manifest.dependencies || {})) {
    maybeAdd(dep, version);
  }

  for (let [dep, version] of Object.entries(manifest.devDependencies || {})) {
    maybeAdd(dep, version);
  }
}

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
run.type = 'tool';
