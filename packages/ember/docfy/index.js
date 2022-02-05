// @ts-check
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 *
 * @typedef {import('posthtml').Plugin<unknown>} HtmlPlugin
 * @typedef {import('posthtml').Node | string} HtmlNode
 */
import { files, js, html, packageJson } from 'ember-apply';

import { default as tailwind } from '@ember-apply/tailwind';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * NOTE: this applyable also applies the tailwind applyable
 *       Tailwind is not required to use Docfy, but has been built around tailwind,
 *       so default stuff will use tailwind.
 *
 *
 * TODO: add some prompt utilities for asking for the:
 *       - app-name
 *       - repository url
 *       - license
 *       - author
 *
 *
 * @param {string} workingDirectory - the directory `npx ember-apply` was invoked fromm
 */
export default async function run(workingDirectory) {
  /**
   * Tailwind is required for this default setup
   */
  await tailwind(workingDirectory);

  /**
   * Add dependencies for Docfy
   */
  await packageJson.addDevDependencies({
    // Required Docfy libraries
    '@docfy/core': '^0.5.0',
    '@docfy/ember': '^0.5.0',
    '@docfy/plugin-with-prose': '^0.5.0',

    // Additional Docfy libraries that could be removed if you have your own design system
    'docfy-theme-ember': 'josemarluedke/docfy-theme-ember',
    '@tailwindcss/typography': '^0.4.1',
    '@frontile/core': '^0.13.0',
    '@frontile/overlays': '^0.13.0',

    // for SEO
    prember: '^1.1.0',
    'ember-cli-fastboot': '^3.2.0-beta.5',

    // Markdown Processing
    // Anything newer than these versions isn't yet compatible
    // see:
    //  - https://github.com/josemarluedke/docfy/issues/93
    'rehype-highlight': '^4.0.0',
    'remark-autolink-headings': '^5.0.0',
    'remark-code-titles': '^0.1.2',
  });

  /**
   * TODO: Apply collected variables, like via .ejs or something
   */
  await files.applyFolder(path.join(__dirname, 'files'));

  /**
   * Changes to existing code
   * - make the index.html more SEO-friendly
   * - updated the router
   */
  await html.transform('app/index.html', [
    setLanguage('en-US'),
    setBodyClasses('text-gray-900 dark:bg-gray-800 dark:text-gray-100'),
    addOpenGraphInfo(),
    addFavicon(),
  ]);

  /**
   * TODO: Install router modifications
   */
  await js.transform('app/router.js', ({ root, j }) => {});

  /**
   * TODO: Update ember-cli-build with prember and fastboot options
   */
  await js.transform('ember-cli-build.js', ({ root, j }) => {});

  /**
   * TODO: Update the tailwind config
   */
}

/**
 * @param {string} classes
 */
function setBodyClasses(classes) {
  /** @type {HtmlPlugin} */
  return (tree) => {
    tree.walk((node) => {
      // TODO: implement

      return node;
    });
  };
}

/**
 * @param {string} locale
 */
function setLanguage(locale) {
  /** @type {HtmlPlugin} */
  return (tree) => {
    tree.walk((node) => {
      // TODO: implement

      return node;
    });
  };
}

function addOpenGraphInfo() {
  /** @type {HtmlPlugin} */
  return (tree) => {
    tree.walk((node) => {
      // TODO: implement

      return node;
    });
  };
}

function addFavicon() {
  /** @type {HtmlPlugin} */
  return (tree) => {
    tree.walk((node) => {
      // TODO: implement

      return node;
    });
  };
}

run.path = __dirname;
