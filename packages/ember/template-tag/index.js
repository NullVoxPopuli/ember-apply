// @ts-check
import assert from 'node:assert';

import { cosmicconfig } from 'cosmicconfig';
import { ember, files, html, js, packageJson, project } from 'ember-apply';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function run() {
  let isEmber = await ember.isEmberProject();

  assert(
    isEmber,
    `This is meant for an ember project -- but the current project at ${process.cwd} was not detected as an ember project`,
  );

  await packageJson.addDevDependencies({
    'ember-template-imports': 'latest',
  });

  if (await packageJson.hasDependency('prettier')) {
    await packageJson.addDevDependencies({
      'prettier-plugin-ember-template-tag': 'latest',
    });

    const prettier = cosmicconfig('prettier');
    /**
     * 1. Add to root
     *   plugins: ['prettier-plugin-ember-template-tag'],
     *
     * 2. add overrides for gjs/gts
     *
     *   {
     *      files: '*.{gjs,gts}',
     *      options: {
     *        parser: 'ember-template-tag',
     *      },
     *    },
     */
    let prettierFile = await js.transform(
      '.prettierrc.js',
      ({ root, j }) => {},
    );
  }
}

const prettierConfig = `
`;

run.path = __dirname;
