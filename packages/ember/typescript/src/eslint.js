import chalk from 'chalk';
import { npm, packageJson } from 'ember-apply';

const standardDeps = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
];

export async function setupESLint() {
  let depsWithVersions = await npm.getLatest(standardDeps);

  await packageJson.addDevDependencies(depsWithVersions);

  // TODO: append an overrides entry
  console.warn(
    chalk.yellow(
      `Updating the .eslintrc.js file to support TypeScript hasn't been automated yet.`,
    ),
  );
}
