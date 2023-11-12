// @ts-check
import { files, html, js, packageJson } from 'ember-apply';
// eslint-disable-next-line n/no-unpublished-import
import { execa } from 'execa';
// eslint-disable-next-line n/no-unpublished-import
import fse from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function run() {
  await packageJson.addDevDependencies({
    'tailwindcss': '^3.0.0',
    'postcss': '^8.0.0',
    'postcss-loader': '^7.0.0',
    'autoprefixer': '^10.0.0'
  });

  await files.applyFolder(path.join(__dirname, 'files/config'), 'config');

  // Standard embroider setup has following line in `ember-cli-build.js`.
  //   `return require("@embroider/compat").compatBuild(app, Webpack, {`
  // We are trying to find the third argument of `compatBuild` and append our `packagerOptions` there.
  await js.transform('ember-cli-build.js', ({ root, j }) => {
    const compatBuild = root
      .find(j.Identifier)
      .filter(path => path.node.name === 'compatBuild');

    if(compatBuild.length === 0) {
      throw new Error(`This appliable works only in embroider enabled projects. Make sure there is 'return require("@embroider/compat").compatBuild...' in your 'ember-cli-build.js`);
    }

    compatBuild.forEach(path => {
      const properties = path.parent.parent.value.arguments[2].properties;

      const packagerOptions = properties.filter(prop => prop.key.name === 'packagerOptions');

      if(packagerOptions.length !== 0) {
        throw new Error(`This appliable can't work if you alrady have 'packagerOptions' in your 'ember-cli-build.js. Try commenting it out and merging the result manually.`);
      }
      
      properties.push(`
        packagerOptions: {
          webpackConfig: {
            module: {
              rules: [
                {
                  test: /.css$/i,
                  use: [
                    {
                      loader: 'postcss-loader',
                      options: {
                        postcssOptions: {
                          config: 'config/postcss.config.js',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        }
      `);
    });
  });

  const appFile = (await fse.pathExists('app/app.ts')) ? 'app/app.ts' : 'app/app.js';

  await js.transform(appFile, ({ root, j }) => {
    root
      .find(j.ImportSpecifier)
      .filter(path => path.node.imported.name === 'config')
      .insertAfter(j.template.expression`import './app.css'`)
  });

  await execa('git', ['add', '.', '-N']);
}

run.path = __dirname;
