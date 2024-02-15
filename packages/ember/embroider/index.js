// @ts-check
import { js, packageJson } from 'ember-apply';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const embroiderOptions = `
staticAddonTestSupportTrees: true,
staticAddonTrees: true,
staticHelpers: true,
staticModifiers: true,
staticComponents: true,
splitAtRoutes: ['route.name'], // can also be a RegExp
packagerOptions: {
   webpackConfig: { }
}
`;

export default async function run() {
  await packageJson.addDevDependencies({
    '@embroider/core': '^3.0.0',
    '@embroider/compat': '^3.0.0',
    '@embroider/webpack': '^3.0.0',
    webpack: '^5.67.0',
  });

  // https://astexplorer.net/#/gist/2dc571cc44c3028eebda3a3956e9e68b/cc4664bee2d84a482cb55be54259d31ece6c9f7d
  await js.transform('ember-cli-build.js', async ({ root, j }) => {
    let appLibPath = 'ember-cli/lib/broccoli/ember-app';
    let specifierName;
    let instanceName;

    // Find out the name of the imported App
    root
      .find(j.VariableDeclarator, {
        init: { arguments: [{ value: appLibPath }] },
      })
      .forEach((path) => {
        // @ts-ignore
        specifierName = path.node.id.name;
      });

    // Find out the name of the created app instance
    root
      .find(j.VariableDeclarator, { init: { callee: { name: specifierName } } })
      .forEach((path) => {
        // @ts-ignore
        instanceName = path.node.id.name;
      });

    // Find the <instanceName>.toTree call and transform it to what
    // the embroider readme says:
    // https://github.com/embroider-build/embroider
    // While initializing `extraPublicTrees`, if it exists
    root
      .find(j.CallExpression, {
        callee: {
          object: { name: instanceName },
          property: { name: 'toTree' },
        },
      })
      .forEach((path) => {
        let node = path.node;
        let isParentAReturn = path.parentPath.value.type === 'ReturnStatement';
        let extraPublicTrees = node.arguments;
        let extraPublicEntry = j.property(
          'init',
          j.identifier('extraPublicTrees'),
          j.arrayExpression(extraPublicTrees)
        );

        extraPublicEntry.comments = trailingComments(j, embroiderOptions);

        let compatBuild = j.callExpression(
          j.memberExpression(
            j.callExpression(j.identifier('require'), [
              j.literal('@embroider/compat'),
            ]),
            j.identifier('compatBuild')
          ),
          [
            j.identifier(instanceName),
            j.identifier('Webpack'),
            j.objectExpression([extraPublicEntry]),
          ]
        );

        let Webpack = j.property(
          'init',
          j.identifier('Webpack'),
          j.identifier('Webpack')
        );

        Webpack.shorthand = true;

        let requireWebpack = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.objectPattern([Webpack]),
            j.callExpression(j.identifier('require'), [
              j.literal('@embroider/webpack'),
            ])
          ),
        ]);

        if (isParentAReturn) {
          let comments = path.parentPath.value.comments;

          requireWebpack.comments = comments;
          j(path.parentPath).insertBefore(requireWebpack);
          j(path.parentPath).replaceWith(j.returnStatement(compatBuild));
        } else {
          // @ts-ignore
          let comments = path.comments;

          requireWebpack.comments = comments;
          j(path).insertBefore(requireWebpack);
          j(path).replaceWith(compatBuild);
        }
      });
  });
}

function trailingComments(j, commentString) {
  return commentString
    .split('\n')
    .map((line) => j.commentLine(` ${line}`, false, true));
}

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
