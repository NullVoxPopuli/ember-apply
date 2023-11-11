// @ts-check
import { files, html, js,packageJson } from 'ember-apply';
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

  await html.insertText('ember-cli-build.js', {
    text: `packagerOptions: {
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
                      config: 'app/config/postcss.config.js',
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },`,
    beforeFirst: 'skipBabel: [',
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
