// @ts-check
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { files, project, html, packageJson } from 'ember-apply';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} workingDirectory - the directory `npx ember-apply` was invoked fromm
 */
export default async function run(workingDirectory) {
  await packageJson.addDevDependencies({
    tailwindcss: '^3.0.0',
  });

  await files.applyFolder(path.join(__dirname, 'files'), 'config/tailwind');
  await html.insertText('app/index.html', {
    text: `<link integrity="" rel="stylesheet" href="{{rootURL}}assets/tailwind.css">\n`,
    beforeFirst: 'link',
  });
  await html.insertText('tests/index.html', {
    text: `<link rel="stylesheet" href="{{rootURL}}assets/tailwind.css">\n`,
    beforeFirst: 'link',
  });

  await packageJson.addScripts({
    'tailwind:build':
      'npx tailwindcss' +
      ' -c ./config/tailwind/tailwind.config.js' +
      ' -i ./config/tailwind/tailwind-input.css' +
      ' -o ./public/assets/tailwind.css',
    'tailwind:watch':
      'npx tailwindcss' +
      ' -c ./config/tailwind/tailwind.config.js' +
      ' -i ./config/tailwind/tailwind-input.css' +
      ' -o ./public/assets/tailwind.css' +
      ' --watch',
    build: 'npm run tailwind:build && ember build --environment=production',
  });

  await project.gitIgnore('public/assets/tailwind.css', '# compiled output');
}

run.path = __dirname;
