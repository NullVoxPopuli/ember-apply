// @ts-check
import { css, js, packageJson } from "ember-apply";
import { execa } from "execa";
import fse from "fs-extra";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getViteConfig() {
  if (await fse.pathExists("vite.config.ts")) {
    return "vite.config.ts";
  }

  if (await fse.pathExists("vite.config.mjs")) {
    return "vite.config.mjs";
  }

  return null;
}

async function updateViteConfig(viteConfig) {
  await js.transform(viteConfig, async ({ root, j }) => {
    // Add import for tailwindcss if it doesn't exist
    const tailwindImportExists =
      root
        .find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === "@tailwindcss/vite")
        .size() > 0;

    if (!tailwindImportExists) {
      root
        .find(j.ImportDeclaration)
        .at(0) // Insert at the top of imports
        .insertBefore(
          j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier("tailwindcss"))],
            j.literal("@tailwindcss/vite")
          )
        );
    } else {
      console.info(
        `Line 'import tailwindcss from "@tailwindcss/vite";' is already present in ${viteConfig}`
      );
    }

    // Locate the plugins array inside defineConfig
    root
      .find(j.CallExpression)
      .filter((path) => path.node.callee.name === "defineConfig")
      .find(j.ObjectExpression)
      .forEach((path) => {
        const pluginsProperty = path.node.properties.find(
          (prop) => prop.key.name === "plugins"
        );

        if (
          pluginsProperty &&
          pluginsProperty.value.type === "ArrayExpression"
        ) {
          const pluginsArray = pluginsProperty.value.elements;

          const tailwindAlreadyAdded = pluginsArray.some(
            (element) =>
              element.type === "CallExpression" &&
              element.callee.name === "tailwindcss"
          );

          if (!tailwindAlreadyAdded) {
            pluginsArray.push(
              j.callExpression(j.identifier("tailwindcss"), [])
            );
          } else {
            console.info(
              `Line 'defineConfig({ plugins: [ tailwindcss() ] })' is already present in ${viteConfig}`
            );
          }
        }
      });
  });
}

async function addAppCssImport() {
  const appFile = (await fse.pathExists('app/app.ts'))
    ? 'app/app.ts'
    : 'app/app.js';

  await js.transform(appFile, async ({ root, j }) => {
    root
      .find(j.ImportDefaultSpecifier)
      .filter((path) => path.node.local?.name === 'config')
      .forEach((path) => {
        path.parent.insertAfter(`import './styles/app.css'`);
      });
  });
}

async function updateAppStyles(appStyles) {
  await css.transform(appStyles, {
    Once(root) {
      // Check if the @import rule already exists
      const hasTailwindImport = root.some(
        (node) =>
          node.type === "atrule" &&
          node.name === "import" &&
          node.params === '"tailwindcss"'
      );

      if (!hasTailwindImport) {
        // Prepend @import "tailwindcss"; at the top of the file
        root.append({
          type: "atrule",
          name: "import",
          params: '"tailwindcss"',
          raws: { after: "\n" },
        });
      } else {
        console.info(
          `Line '@import "tailwindcss";' already exists in ${appStyles}`
        );
      }
    },
  });
}

export default async function run() {
  const viteConfig = await getViteConfig();

  if (!viteConfig) {
    console.error(
      "Error: Neither vite.config.ts nor vite.config.js was found. You probably wanted to create the app via: `ember new my-app --blueprint='@embroider/app-blueprint'`"
    );

    return;
  }

  updateViteConfig(viteConfig);

  await packageJson.addDevDependencies({
    tailwindcss: "^4.1.11",
    "@tailwindcss/vite": "^4.1.11",
  });

  updateAppStyles("./app/styles/app.css");

  addAppCssImport();

  await execa("git", ["add", ".", "-N"]);
}

run.path = __dirname;
