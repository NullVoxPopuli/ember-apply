import { packageJson } from 'ember-apply';

/**
 * ember-data has not yet published types compatible with ember-source
 */
export async function isEmberDataPresent() {
  let manifest = await packageJson.read();
  let allDeps = [
    ...Object.keys(manifest.dependencies || {}),
    ...Object.keys(manifest.devDependencies || {}),
  ];

  return allDeps.some(
    (dep) => dep.startsWith('@ember-data') || dep === 'ember-data',
  );
}

export async function canUseBuiltInTypes() {
  let newEnoughEmberSource = await packageJson.hasDependency(
    'ember-source',
    '>= 5.1',
  );
  let noEmberData = !(await isEmberDataPresent());

  /**
   * At some point ember-data will have types compatible with the built in types,
   * and at that point, we'll need to add some version checks
   */
  return newEnoughEmberSource && noEmberData;
}
