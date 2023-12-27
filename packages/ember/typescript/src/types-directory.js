import { stripIndent } from 'common-tags';
import fse from 'fs-extra';

import { canUseBuiltInTypes } from './queries.js';

export async function createAppTypesDirectory() {
  await fse.ensureDir('types');

  if (await canUseBuiltInTypes()) {
    await fse.writeFile(
      'types/global.d.ts',
      stripIndent`
        // Declare the @ember/* packages brought in from ember-source
        import 'ember-source/types';
      `,
    );
  }

  await fse.writeFile(
    `types/glint.d.ts`,
    stripIndent`
      // Setup Glint Globals
      import '@glint/environment-ember-loose';
      import '@glint/environment-ember-template-imports';

      declare module '@glint/environment-ember-loose/registry' {
        // Remove this once entries have been added! 👇
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export default interface Registry {
          // Add any registry entries from other addons here that your addon itself uses (in non-strict mode templates)
          // See https://typed-ember.gitbook.io/glint/using-glint/ember/using-addons
        }
      }
    `,
  );
}

export async function createAddonTypesDirectory() {
  if (await canUseBuiltInTypes()) {
    await fse.writeFile(
      'types/global.d.ts',
      stripIndent`
        // Declare the @ember/* packages brought in from ember-source
        import 'ember-source/types';
      `,
    );
  }

  await fse.writeFile(
    `unpublished-development-types/glint.d.ts`,
    stripIndent`
      // Add any types here that you need for local development only.
      // These will *not* be published as part of your addon, so be careful that your published code does not rely on them!
      import '@glint/environment-ember-loose';
      import '@glint/environment-ember-template-imports';

      declare module '@glint/environment-ember-loose/registry' {
        // Remove this once entries have been added! 👇
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export default interface Registry {
          // Add any registry entries from other addons here that your addon itself uses (in non-strict mode templates)
          // See https://typed-ember.gitbook.io/glint/using-glint/ember/using-addons
        }
      }
    `,
  );
}
