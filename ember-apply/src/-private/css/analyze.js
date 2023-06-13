// @ts-check
import fs from 'fs/promises';
import postcss from 'postcss';

/**
 * Given a file path to a css file, this will run
 * a postcss plugin over the file for analysis purposes.
 * This is useful for pre-determining if a css file meets a condition, or has something that you may be looking for that could then provide more information to influence other decisions.
 *
 * See [the plugin docs for postcss](https://github.com/postcss/postcss/blob/main/docs/plugins.md) for more information.
 *
 * @example
 * ```js
 * import { css } from 'ember-apply';
 *
 * await css.transform('path/to/file.css', {
 *   Once(root) {
 *     root.walkRules(rule => {
 *
 *       rule.walkDecls(decl => {
 *         decl.prop = decl.prop.split('').reverse().join('');
 *       });
 *     });
 *   }
 * });
 * ```
 *
 * @param {string} filePath to the file to transform
 * @param {import('postcss').Plugin} plugin
 * @returns {Promise<string>} the transformed source
 */
export async function analyze(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();

  let processor = postcss([
    {
      ...plugin,
      postcssPlugin: 'postcss-ember-apply-ephemeral-plugin',
    },
  ]);

  let transformed = processor.process(code, {
    // Explicitly set the `from` option to `undefined` to prevent
    // sourcemap warnings which aren't relevant to this use case.
    from: undefined,
  });

  return transformed.css;
}
