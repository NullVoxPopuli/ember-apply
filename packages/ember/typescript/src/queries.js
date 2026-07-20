import { packageJson } from 'ember-apply';

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

/**
 * ember-data >= 4.0.0 ships its own TypeScript types and no longer requires
 * the DefinitelyTyped @types/ember-data* packages.
 * The @ember-data/* scoped packages have always shipped their own types.
 */
export async function isEmberDataWithBuiltInTypes() {
  let manifest = await packageJson.read();
  let allDeps = {
    ...(manifest.dependencies || {}),
    ...(manifest.devDependencies || {}),
  };

  // All @ember-data/* scoped packages ship their own types
  let hasEmberDataSubPackages = Object.keys(allDeps).some((dep) =>
    dep.startsWith('@ember-data/'),
  );

  if (hasEmberDataSubPackages) return true;

  // The ember-data meta-package >= 4.0.0 ships its own types
  return packageJson.hasDependency('ember-data', '>= 4.0.0');
}

export async function canUseBuiltInTypes() {
  let newEnoughEmberSource = await packageJson.hasDependency(
    'ember-source',
    '>= 5.1',
  );
  let noEmberData = !(await isEmberDataPresent());
  let emberDataHasOwnTypes = await isEmberDataWithBuiltInTypes();

  return newEnoughEmberSource && (noEmberData || emberDataHasOwnTypes);
}
