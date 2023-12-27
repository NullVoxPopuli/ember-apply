import chalk from 'chalk';
import { js } from 'ember-apply';

export async function enableTSInECBuild() {
  await js.transform('ember-cli-build.js', async ({ root, j }) => {
    let emberAppName = '';

    // find const EmberApp = require('ember-cli/lib/broccoli/ember-app');
    root
      .find(j.VariableDeclarator, {
        init: {
          callee: { name: 'require' },
          arguments: [{ value: 'ember-cli/lib/broccoli/ember-app' }],
        },
      })
      .forEach((path) => {
        let node = path.node;

        if (node.id.type === 'Identifier') {
          emberAppName = node.id.name;
        }
      });

    if (!emberAppName) {
      return couldNot();
    }

    // find the second object passed to EmberApp
    //   let app = new EmberApp(defaults, {
    /** @type {import('ast-types').namedTypes.ObjectExpression | undefined} */
    let config = undefined;

    root
      .find(j.NewExpression, { callee: { name: emberAppName } })
      .forEach((path) => {
        let secondArg = path.node.arguments[1];

        if (secondArg.type === 'ObjectExpression') {
          config = secondArg;
        }
      });

    if (!config) {
      return couldNot();
    }

    // TODO: why is `config` type `never`?
    //       wat
    /** @type {import('ast-types').namedTypes.ObjectExpression} */
    let configObject = config;

    // make `ember-cli-babel` exist as a config object
    let ecb = configObject.properties.find((property) => {
      if (property.type === 'Property') {
        if (property.key.type === 'Literal') {
          return property.key.value === 'ember-cli-babel';
        }
      }

      return false;
    });

    let ts = j.property(
      'init',
      j.identifier('enableTypeScriptTransform'),
      j.literal(true),
    );

    if (!ecb) {
      ecb = j.property(
        'init',
        j.literal('ember-cli-babel'),
        j.objectExpression([ts]),
      );
      configObject.properties.unshift(ecb);

      return;
    }

    if (ecb.type === 'Property') {
      let theActualObject = ecb.value;

      if (theActualObject.type === 'ObjectExpression') {
        theActualObject.properties.unshift(ts);

        return;
      }
    }

    couldNot();
  });
}

function couldNot() {
  console.warn(
    chalk.yellow(
      `Could not determine where to enable TypeScripts in ember-cli-build.js. Please refer to the docs: https://github.com/emberjs/ember-cli-babel#enabling-typescript-transpilation`,
    ),
  );
}

export async function enableTSInAddonIndex() {}
