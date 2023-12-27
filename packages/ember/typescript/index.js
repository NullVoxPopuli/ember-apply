// @ts-check
import assert from 'node:assert';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ember, packageJson, project } from 'ember-apply';

import { createConfigDTS } from './src/config-directory.js';
import {
  enableTSInAddonIndex,
  enableTSInECBuild,
} from './src/ensure-ts-transpilation.js';
import { setupESLint } from './src/eslint.js';
import { printDetectedInfo } from './src/info.js';
import {
  adjustAddonScripts,
  adjustAppScripts,
  configureDependencies,
} from './src/package-json.js';
import { createAddonTSConfig, createAppTSConfig } from './src/tsconfig.js';
import {
  createAddonTypesDirectory,
  createAppTypesDirectory,
} from './src/types-directory.js';

/**
 * Codemod to transferm a JS ember project to a TS ember project.
 * - Support
 *   - V1 App
 *   - V1 Addon
 *   - ember-data presence forcing the ejection of built in types
 *     (ember-data's types are not compatible with the built in types)
 *
 * - No Support
 *   - V2 Addon
 *
 */
export default async function run() {
  let isEmber = await ember.isEmberProject();

  assert(
    isEmber,
    `Project is not an ember project, so typescript will not be applied`,
  );

  let isAddon = await ember.isAddon();
  let isApp = !isAddon;
  let isV2Addon = await ember.isV2Addon();

  assert(
    !isV2Addon,
    `Project is a V2 addon and cannot be automatically updated to use TypeScript as V2 addons have too much variation. Confer with the V2 addon blueprint's --typescript output for details on using TypeScript: https://github.com/embroider-build/addon-blueprint/`,
  );

  assert(
    await packageJson.hasDependency('ember-source', '>= 3.24.0'),
    `ember-source version must be at least 3.24`,
  );

  if (isApp) {
    return appToTypeScript();
  }

  return addonToTypeScript();
}

async function appToTypeScript() {
  await printDetectedInfo();
  await enableTSInECBuild();
  await createConfigDTS();
  await createAppTSConfig();
  await createAppTypesDirectory();
  await adjustAppScripts();
  await setupESLint();
  await configureDependencies();

  // Grrr GlimmerVM
  await fixPre1dot0GlimmerAndPnpm();

  let manager = await project.getPackageManager();

  console.info(`
    ✨✨✨

    🥳 Your JavaScript app is now a TypeScript app 🥳

    Tasks to manually do
    - run '${manager} install'
    - make sure '${manager} run lint:types' succeeds
    - commit!

    ✨✨✨
  `);
}

async function addonToTypeScript() {
  await enableTSInECBuild(); // dummy app
  await enableTSInAddonIndex();
  await createAddonTSConfig();
  await createAddonTypesDirectory();
  await adjustAddonScripts();
  await setupESLint();
  await configureDependencies();
}

/**
 * Without this we get a super old copy of manager/validator in the 0.4x range
 */
async function fixPre1dot0GlimmerAndPnpm() {
  let manager = await project.getPackageManager();

  if (manager !== 'pnpm') return;

  let root = await project.workspaceRoot();

  await packageJson.modify((json) => {
    json.pnpm ||= {};
    json.pnpm.overrides ||= {};
    json.pnpm.overrides['@glimmer/manager'] ||= '>= 0.84.3';
    json.pnpm.overrides['@glimmer/validator'] ||= '>= 0.84.3';
  }, root);
}

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
