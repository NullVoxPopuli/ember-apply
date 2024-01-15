import chalk from 'chalk';
import { ember, js } from 'ember-apply';

export async function enableTSInECBuild() {
  await js.transform('ember-cli-build.js', async ({ root, j }) => {
    let utils = buildUtils(root, j);
    let emberAppName = (await ember.isAddon)
      ? utils.getRequireName('ember-cli/lib/broccoli/ember-addon')
      : utils.getRequireName('ember-cli/lib/broccoli/ember-app');

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

/**
 * @typedef {import('jscodeshift')} JSCodeshift
 * @typedef {ReturnType<JSCodeshift>} jAST
 *
 * @param {jAST} root
 * @param {JSCodeshift} j
 */
function buildUtils(root, j) {
  return {
    /**
     * @param {string} requirePath
     */
    getRequireName(requirePath) {
      let name = '';

      // find const EmberApp = require('ember-cli/lib/broccoli/ember-app');
      root
        .find(j.VariableDeclarator, {
          init: {
            callee: { name: 'require' },
            arguments: [{ value: requirePath }],
          },
        })
        .forEach((path) => {
          let node = path.node;

          if (node.id.type === 'Identifier') {
            name = node.id.name;
          }
        });

      return name;
    },
  };
}

export async function enableTSInAddonIndex() {
  await js.transform('index.js', async ({ root, j }) => {
    /** @type {import('ast-types').namedTypes.ObjectExpression | undefined} */
    let config;

    // Get the object assigned to module.exports
    //
    // module.exports = { ... }
    root
      .find(j.AssignmentExpression, {
        left: { object: { name: 'module' }, property: { name: 'exports' } },
      })
      .forEach((path) => {
        if (path.node.right.type === 'ObjectExpression') {
          config = path.node.right;
        }
      });

    if (!config) {
      return couldNotUpdateIndex();
    }

    // Ensure an options object exists and that we have a reference to it.
    /** @type {import('ast-types').namedTypes.ObjectExpression | undefined} */
    let options;

    j(config)
      .find(j.Property, { key: { name: 'options' } })
      .forEach((path) => {
        if (path.node.value.type === 'ObjectExpression') {
          options = path.node.value;
        }
      });

    if (!options) {
      let optionsProperty = j.property(
        'init',
        j.identifier('options'),
        j.objectExpression([]),
      );

      config.properties.push(optionsProperty);

      if (optionsProperty.value.type === 'ObjectExpression') {
        options = optionsProperty.value;
      }
    }

    // make `ember-cli-babel` exist as a config object
    let ecb = /** @type {import('ast-types').namedTypes.ObjectExpression} */ (
      options
    ).properties.find((property) => {
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

      /** @type {import('ast-types').namedTypes.ObjectExpression} */
      (options).properties.unshift(ecb);

      return;
    }

    if (ecb.type === 'Property') {
      let theActualObject = ecb.value;

      if (theActualObject.type === 'ObjectExpression') {
        theActualObject.properties.unshift(ts);

        return;
      }
    }

    couldNotUpdateIndex();
  });
}

function couldNotUpdateIndex() {
  console.warn(
    chalk.yellow(
      `Could not determine where to enable TypeScript in index.js. Please refer to the docs: https://github.com/emberjs/ember-cli-babel#enabling-typescript-transpilation`,
    ),
  );
}
