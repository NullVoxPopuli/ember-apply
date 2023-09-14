import path from 'node:path';

import fse from 'fs-extra';
import { globby } from 'globby';

import { analyze } from '../js/analyze.js';

const roots = [
  ['dist/packages', '**/index.js'],
  ['dist/dependencies', '**/*'],
];

/**
 * @param {string} emberSourcePath path to ember-source
 */
export async function generateEmberSourceImportMap(emberSourcePath) {
  /**
   * @type {{ imports: Record<string, string> }}
   */
  let json = { imports: {} };

  let manifestPath = path.join(emberSourcePath, 'package.json');
  let manifest = await fse.readJSON(manifestPath);
  let rootURL = `https://esm.sh/ember-source@${manifest.version}`;

  for (let [folder, glob] of roots) {
    let paths = await globby(glob, { cwd: path.join(emberSourcePath, folder) });

    for (let filePath of paths) {
      // get externals
      /** @type {string[]} */
      let externals = [];

      await analyze(
        path.join(emberSourcePath, folder, filePath),
        ({ root, j }) => {
          root.find(j.ImportDeclaration).forEach((path) => {
            let importPath = path.node.source.value;

            externals.push(importPath);
          });
        },
      );

      // build URL
      let moduleName = filePath.replace(/\.(js|ts)$/, '');

      moduleName = moduleName.replace(/\/index$/, '');

      let url = `${rootURL}/${folder}/${filePath}?external=${externals.join(
        ',',
      )}`;

      json.imports[moduleName] = url;
    }
  }

  console.info(
    `<script type="importmap">\n${JSON.stringify(json, null, 2)}\n</script>`,
  );
}

// generateEmberSourceImportMap(
//   path.join(process.cwd(), 'node_modules/ember-source'),
// );
