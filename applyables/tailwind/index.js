// @ts-check
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  addScripts,
  addDevDependencies,
  gitIgnore,
  applyFolder,
  addHTML,
} from '../../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} workingDirectory - the directory `npx ember-apply` was invoked fromm
 */
export default async function run(workingDirectory) {
  await addDevDependencies({
    autoprefixer: '^10.0.0',
    postcss: '^8.0.0',
    tailwindcss: '^3.0.0',
  });

  await applyFolder(path.join(__dirname, 'files'));
  await addHTML(
    'app/index.html',
    `<link integrity="" rel="stylesheet" href="{{rootURL}}assets/tailwind.css">`,
    { before: 'link' }
  );
  await addHTML(
    'tests/index.html',
    `<link rel="stylesheet" href="{{rootURL}}assets/tailwind.css">`,
    { before: 'link' }
  );

  await addScripts({
    'tailwind:build': 'npx tailwindcss -i ./tailwind-input.css -o ./public/assets/tailwind.css',
    'tailwind:watch':
      'npx tailwindcss -i ./tailwind-input.css -o ./public/assets/tailwind.css --watch',
    build: 'npm run tailwind:build && ember build --environment=production',
  });

  await gitIgnore('public/assets/tailwind.css', '# compiled output');
}
