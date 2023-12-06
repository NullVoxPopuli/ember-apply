import fs from 'node:fs/promises';

import { stripIndent } from 'common-tags';
import fse from 'fs-extra';

import { getModuleName } from './utils.js';

export async function createConfigDTS() {
  let name = await getModuleName();

  await fse.ensureDir('app/config');

  await fs.writeFile(
    'app/config/environment.d.ts',
    stripIndent`
      /**
       * Type declarations for
       *    import config from '${name}/config/environment'
       */
      declare const config: {
        environment: string;
        modulePrefix: string;
        podModulePrefix: string;
        locationType: 'history' | 'hash' | 'none';
        rootURL: string;
        APP: Record<string, unknown>;
      };

      export default config;
      `,
  );
}
