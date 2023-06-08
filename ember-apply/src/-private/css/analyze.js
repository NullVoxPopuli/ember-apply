// @ts-check
import fs from "fs/promises";
import postcss from "postcss";

/**
 *
 * @param {string} filePath to the file to transform
 * @param {import('postcss').Plugin} plugin
 * @returns {Promise<string>} the transformed source
 */
export async function analyze(filePath, plugin) {
  let code = (await fs.readFile(filePath)).toString();

  let processor = postcss([
    {
      postcssPlugin: "postcss-ember-apply-ephemeral-plugin",
      ...plugin,
    },
  ]);

  let transformed = processor.process(code, {
    // Explicitly set the `from` option to `undefined` to prevent
    // sourcemap warnings which aren't relevant to this use case.
    from: undefined,
  });

  return transformed.css;
}
