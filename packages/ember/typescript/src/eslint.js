import { npm, packageJson } from 'ember-apply';

const standardDeps = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
];

export async function setupESLint() {
  let depsWithVersions = await npm.getLatest(standardDeps);

  await packageJson.addDevDependencies(depsWithVersions);

  // TODO: append an overrides entry
}
