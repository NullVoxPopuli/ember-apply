import { packageJson } from 'ember-apply';

import { canUseBuiltInTypes, isEmberDataPresent } from './queries.js';

export async function printDetectedInfo() {
  /** @type {any} */
  let manifest = await packageJson.read();

  let allDeps = {
    ...(manifest.devDependencies || {}),
    ...(manifest.dependencies || {}),
  };

  let emberSource = allDeps['ember-source'];
  let emberCli = allDeps['ember-cli'];
  let emberCliBabel = allDeps['ember-cli-babel'];

  console.info(`
    Specified Versions:
      ember-cli:       ${emberCli}
      ember-source:    ${emberSource} 
      ember-cli-babel: ${emberCliBabel}

    Queries:
      has ember-data?         ${await isEmberDataPresent()}
      can use built in types? ${await canUseBuiltInTypes()}
  `);
}
