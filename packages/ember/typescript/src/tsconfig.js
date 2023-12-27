import fs from 'node:fs/promises';

import { stripIndent } from 'common-tags';

import { getModuleName } from './utils.js';

export async function createAppTSConfig() {
  let name = await getModuleName();

  await fs.writeFile(
    'tsconfig.json',
    stripIndent`
    {
      "extends": "@tsconfig/ember/tsconfig.json",
      "compilerOptions": {
        // The combination of \`baseUrl\` with \`paths\` allows Ember's classic package
        // layout, which is not resolvable with the Node resolution algorithm, to
        // work with TypeScript.
        "baseUrl": ".",
        "paths": {
          "${name}/tests/*": ["tests/*"],
          "${name}/*": ["app/*"],
          "*": ["types/*"]
        }
      },
      "glint": {
        "environment": ["ember-loose", "ember-template-imports"]
      }
    }  
  `,
  );
}

export async function createAddonTSConfig() {
  let name = await getModuleName();

  await fs.writeFile(
    'tsconfig.json',
    stripIndent`
    {
      "extends": "@tsconfig/ember/tsconfig.json",
      "compilerOptions": {
        // The combination of \`baseUrl\` with \`paths\` allows Ember's classic package
        // layout, which is not resolvable with the Node resolution algorithm, to
        // work with TypeScript.
        "baseUrl": ".",
        "paths": {
          "dummy/tests/*": ["tests/*"],
          "dummy/*": ["tests/dummy/app/*", "app/*"],
          "${name}": ["addon"],
          "${name}/*": ["addon/*"],
          "${name}/test-support": ["addon-test-support"],
          "${name}/test-support/*": ["addon-test-support/*"],
          "*": ["types/*"]
        }
      },
      "glint": {
        "environment": ["ember-loose", "ember-template-imports"]
      }
    }  
  `,
  );
}
