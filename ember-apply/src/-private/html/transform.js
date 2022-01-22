// @ts-check

import fs from 'fs/promises';

import posthtml from 'posthtml';

/**
 *
 * @typedef {posthtml.Plugin<unknown>} Plugin
 * @typedef {posthtml.Node | string} Node
 *
 * @typedef {object} AddHTMLOptions
 * @property {string} before which tag to insert text before
 */

/**
 * Transform HTML
 *
 * Uses [posthtml](https://posthtml.org/#/) for transformation.
 * See: [posthtml plugins](https://github.com/posthtml/posthtml-plugins/blob/master/src/pluginsNames.json) for examples.
 *
 * @example
 * the `before` option is to insert HTML before the first tag specified -- `link` in this case.
 *
 * ```js
 * import { html } from 'ember-apply';
 *
 * await html.transform(filePath, (tree) => {
 *   tree.match(({ tag: 'head' }, 'head') => {
 *     if (node.content) {
 *       node.content.unshift({ tag: 'noscript', content: 'Please enable javascript' });
 *     }
 *
 *     return node;
 *   });
 * });
 * ```
 *
 * Example borrowed from posthtml-noscript
 *
 * @param {string} filePath
 * @param {Plugin | Plugin[]} plugin
 */
export async function transform(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();

  let plugins = Array.isArray(plugin) ? plugin : [plugin];
  let result = await posthtml(plugins).process(code);

  await fs.writeFile(filePath, result.html);
}

/**
 * Add a string of HTML to an HTML document.
 *
 * @example
 * the `before` option is to insert HTML before the first tag specified -- `link` in this case.
 * ```js
 * import { html } from 'ember-apply';
 *
 * await html.inserText('app/index.html', {
 *   text: `<link integrity="" rel="stylesheet" href="{{rootURL}}assets/tailwind.css">`,
 *   beforeFirst: 'link',
 * });
 * ```
 *
 * @typedef {object} InsertBeforeFirstOptions
 * @property {string} beforeFirst the HTML tag to insert `text` before
 * @property {string} text the HTML to inject before the first tag matching `tag`
 *
 * @param {string} filePath
 * @param {InsertBeforeFirstOptions} options
 */
export async function insertText(filePath, { beforeFirst, text }) {
  let code = (await fs.readFile(filePath)).toString();

  if (code.includes(text)) {
    return;
  }

  /**
   * @param {string} tag
   * @param {string} text
   */
  function insertBeforeFirst(tag, text) {
    /** @type {Plugin} */
    return (tree) => {
      let found = false;
      /** @type {Node} */
      let previousNode;

      // Types are wrong for Node. tag: false is how you say "array of any content"
      // @ts-expect-error
      tree.walk((node) => {
        if (!found && node.tag === tag) {
          found = true;

          if (typeof previousNode === 'string') {
            let parts = previousNode.split('\n');
            let indentation = parts[parts.length - 1];

            return { tag: false, content: [text, indentation, node], attrs: {} };
          }

          return { tag: false, content: [text, node], attrs: {} };
        }

        previousNode = node;

        return node;
      });

      return tree;
    };
  }

  return await transform(filePath, insertBeforeFirst(beforeFirst, text));
}
