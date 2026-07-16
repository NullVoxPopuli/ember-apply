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
];

// The Ember TypeScript tooling (glint) does not support TypeScript 7 yet --
// TS 7 dropped the language service plugin API that glint relies on -- so cap
// TypeScript at the latest supported major (v6).
const TYPESCRIPT_VERSION = '<7';

export async function configureDependencies() {
  if (await canUseBuiltInTypes()) {
    let depsWithVersions = await npm.getLatest(standardDeps);

    depsWithVersions['typescript'] = TYPESCRIPT_VERSION;

    await packageJson.addDevDependencies(depsWithVersions);

    return;
  }

  const extraDeps = [
    '@types/ember',
    '@types/ember__application',
    '@types/ember__array',
    '@types/ember__component',
    '@types/ember__controller',
    '@types/ember__debug',
    '@types/ember__destroyable',
    '@types/ember__engine',
    '@types/ember__error',
    '@types/ember__helper',
    '@types/ember__modifier',
    '@types/ember__object',
    '@types/ember__owner',
    '@types/ember__polyfills',
    '@types/ember__routing',
    '@types/ember__runloop',
    '@types/ember__service',
    '@types/ember__string',
    '@types/ember__template',
    '@types/ember__test',
    '@types/ember__utils',
  ];

  if (await isEmberDataPresent()) {
    extraDeps.push(
      '@types/ember-data',
      '@types/ember-data__adapter',
      '@types/ember-data__model',
      '@types/ember-data__serializer',
      '@types/ember-data__store',
    );
  }

  let depsWithVersions = await npm.getLatest([...standardDeps, ...extraDeps]);

  depsWithVersions['typescript'] = TYPESCRIPT_VERSION;

  await packageJson.addDevDependencies(depsWithVersions);
}
