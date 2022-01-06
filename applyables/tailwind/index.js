import { copyFileTo, addScripts, addDevDependencies } from 'ember-apply';

/**
 * @param {string} workingDirectory - the directory `npx ember-apply` was invoked fromm
 */
export default async function run(workingDirectory) {
  await addDevDependencies(
    {
      autoprefixer: '^10.0.0',
      postcss: '^8.0.0',
      tailwindcss: '^3.0.0',
    },
    { cwd: workingDirectory }
  );
  await transformFiles(workingDirectory);
  await addScripts(
    {
      'tailwind:build': 'npx tailwindcss -i ./tailwind-input.css -o ./public/assets/tailwind.css',
      'tailwind:watch':
        'npx tailwindcss -i ./tailwind-input.css -o ./public/assets/tailwind.css --watch',
      build: 'npm run tailwind:build && ember build --environment=production',
    },
    { cwd: workingDirectory }
  );
}

async function transformFiles(workingDirectory) {}
