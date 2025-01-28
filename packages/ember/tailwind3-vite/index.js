// @ts-check
import { js, packageJson } from "ember-apply";
import { execa } from "execa";
import fse from "fs-extra";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function run() {
  await packageJson.addDevDependencies({
    tailwindcss: "^3.0.0",
    postcss: "^8.0.0",
    autoprefixer: "^10.0.0",
  });

  await execa("npx", ["tailwindcss@^3.4.17", "init", "-p"], { preferLocal: true, shell: true });

  await fse.rename("tailwind.config.js", "tailwind.config.cjs");
  await fse.rename("postcss.config.js", "postcss.config.cjs");

  await fse.writeFile("app/app.css", [
    '@tailwind base',
    '@tailwind components',
    '@tailwind utilities'
  ].join('\n'));

  await js.transform("tailwind.config.cjs", async ({ root, j }) => {
    root
      .find(j.AssignmentExpression, {
        left: {
          object: { name: "module" },
          property: { name: "exports" },
        },
      })
      .forEach((path) => {
        const contentProperty = path.value.right.properties.find(
          (prop) => prop.key.name === "content"
        );

        contentProperty.value.elements.push(
          j.literal("app/**/*.{js,ts,hbs,gjs,gts,html}")
        );
      });
  });

  await js.transform("postcss.config.cjs", async ({ root, j }) => {
    root
      .find(j.AssignmentExpression, {
        left: {
          object: { name: "module" },
          property: { name: "exports" },
        },
      })
      .forEach((path) => {
        const pluginsProperty = path.value.right.properties.find(
          (prop) => prop.key.name === "plugins"
        );

        const tailwindcssProperty = pluginsProperty.value.properties.find(
          (prop) => prop.key.name === "tailwindcss"
        );

        tailwindcssProperty.value.properties.push(
          j.property(
            "init",
            j.identifier("config"),
            j.literal("tailwind.config.js")
          )
        );
      });
  });

  const appFile = (await fse.pathExists("app/app.ts"))
    ? "app/app.ts"
    : "app/app.js";

  await js.transform(appFile, async ({ root, j }) => {
    root
      .find(j.ImportDefaultSpecifier)
      .filter((path) => path.node.local?.name === "config")
      .forEach((path) => {
        path.parent.insertAfter(`import './app.css'`);
      });
  });

  await execa("git", ["add", ".", "-N"]);
}

run.path = __dirname;
