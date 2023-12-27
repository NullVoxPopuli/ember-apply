import { npm, packageJson } from 'ember-apply';

export async function adjustAppScripts() {
  await packageJson.addScript('lint:types', 'glint');
}

import { canUseBuiltInTypes, isEmberDataPresent } from './queries.js';

export async function adjustAddonScripts() {
  throw new Error(`Addons are not yet supported. PR's welcome!`);
}

const standardDeps = [
  '@tsconfig/ember',
  '@glint/core',
  '@glint/template',
  '@glint/environment-ember-loose',
  '@glint/environment-ember-template-imports',
  '@types/qunit',
  '@types/rsvp',
  'typescript',
];

export async function configureDependencies() {
  let depsWithVersions = await npm.getLatest(standardDeps);

  await packageJson.addDevDependencies(depsWithVersions);

  if (await canUseBuiltInTypes()) {
    /* nothing to do, types are built in to ember-source and ember-data */
    return;
  } else {
    if (await isEmberDataPresent()) {
      throw new Error(`Ember data isn't yet supported. PR's welcome!`);
    }
  }
}
