// @ts-check

/**
 *
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {object} AddHTMLOptions
 * @property {string} before which tag to insert text before
 *
 * @typedef {import('hast').Root} Root
 * @typedef {import('unified').Plugin<Array<void>, Root, Root>} Plugin
 *
 * @typedef {import('unified').CompilerFunction<Node, string>} CompilerFunction
 */

import fs from 'fs/promises';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import rehypeRaw from 'rehype-raw';

/**
 * Transform HTML with rehype
 *
 * @example
 * the `before` option is to insert HTML before the first tag specified -- `link` in this case.
 * ```js
 * import { html } from 'ember-apply';
 * import { visit } from 'unist-util-visit';
 *
 * await html.transform(filePath, (tree) => {
 *   let found = false;
 *
 *   visit(tree, (node, index, parent) => {
 *     let trailing = parent.children.splice(index);
 *
 *     // delete children nodes
 *     parent.children = [];
 *   });
 * });
 * ```
 *
 * @param {string} filePath
 * @param {(tree: Node) => void} plugin
 */
export async function transform(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();

  let transformed = await unified()
    .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
    .use(() => plugin)
    .use(rehypeRaw, { passThrough: ['text', 'html'] })
    .use(rehypeStringify, {
      upperDoctype: true,
      allowDangerousHtml: true,
    })
    .process(code);

  await fs.writeFile(filePath, transformed.value);
}

/**
 * Add a string of HTML to an HTML document.
 *
 * @example
 * the `before` option is to insert HTML before the first tag specified -- `link` in this case.
 * ```js
 * import { html } from 'ember-apply';
 *
 * await html.add(
 *   'app/index.html',
 *   `<link integrity="" rel="stylesheet" href="{{rootURL}}assets/tailwind.css">`,
 *   { before: 'link' }
 * );
 * ```
 *
 * @param {string} filePath
 * @param {string} html the HTML to inject before the first tag matching `before`
 * @param {AddHTMLOptions} options
 */
export async function add(filePath, html, { before = '' }) {
  let code = (await fs.readFile(filePath)).toString();

  if (code.includes(html)) {
    return;
  }

  /**
   * @type {Node[]}
   */
  let targetAST = [];

  await unified()
    .use(rehypeParse, { fragment: true })
    .use(() => (tree) => {
      targetAST = tree.children;
    })
    .use(
      rehypeStringify,
      // @ts-expect-error
      { fragment: true }
    )
    .process(html);

  await transform(filePath, (tree) => {
    let found = false;

    visit(
      tree,
      { type: 'element', tagName: before },
      /**
       * @param {Node} node
       * @param {number} index
       * @param {Parent} parent
       */
      (_node, index, parent) => {
        if (found) {
          return;
        }

        found = true;

        let trailing = parent.children.splice(index);

        parent.children = [...parent.children, ...targetAST, ...trailing];
      }
    );
  });
}
