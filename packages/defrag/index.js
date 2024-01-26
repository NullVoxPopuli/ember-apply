// @ts-check
import { project } from 'ember-apply';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPackages } from '@manypkg/get-packages';
import { cosmiconfig } from 'cosmiconfig';

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

  console.log(configResult);

  if (projectResult.rootPackage) {
    injestDeps(projectResult.rootPackage?.packageJson);
  }

  for (let pkg of projectResult.packages) {
    injestDeps(pkg.packageJson);
  }

  console.log(DEPS);
}

/**
 * @param {import('./types').Manifest} manifest
 */
function injestDeps(manifest) {
  for (let [dep, version] of Object.entries(manifest.dependencies || {})) {
    let versions = DEPS.get(dep);
    if (!versions) {
      versions = new Set();
      DEPS.set(dep, versions);
    }

    versions.add(version);
  }

  for (let [dep, version] of Object.entries(manifest.devDependencies || {})) {
    let versions = DEPS.get(dep);
    if (!versions) {
      versions = new Set();
      DEPS.set(dep, versions);
    }

    versions.add(version);
  }
}

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
run.type = 'tool';
