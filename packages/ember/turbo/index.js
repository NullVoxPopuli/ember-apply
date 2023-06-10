// @ts-check
import { files, html, packageJson, project, ember } from "ember-apply";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

const LINTS = {
  prettier: {
    scripts: {
      "lint:prettier:fix": "prettier --write .",
      "lint:prettier": "prettier --check .",
    },
    deps: ["prettier", "prettier-plugin-ember-template-tag"],
  },
  eslint: {
    scripts: {
      "lint:js": "eslint .",
      "lint:js:fix": "pnpm lint:js --fix",
    },
    deps: [
      "@nullvoxpopuli/eslint-configs",
      "eslint",
      "@babel/eslint-parser",
      "eslint-plugin-ember",
      "eslint-plugin-n",
    ],
  },
  templates: {
    scripts: {
      "lint:hbs": "ember-template-lint . --no-error-on-unmatched-pattern",
      "lint:hbs:fix": "pnpm lint:hbs --fix",
    },
    deps: ["ember-template-lint"],
  },
  css: {
    scripts: {
      "lint:css": 'stylelint "**/*.css"',
      "lint:css:fix": "pnpm lint:css --fix",
    },
    deps: ["stylelint", "stylelint-config-standard"],
  },
  package: {
    scripts: {
      pack: "pnpm pack",
      "lint:package": "publint",
      "lint:published-types": "attw *.tgz || exit 0",
    },
    deps: ["@arethetypeswrong/cli", "publint"],
  },
  typescript: {
    scripts: {
      "lint:types": "tsc --noEmit",
    },
    deps: [
      "@tsconfig/ember",
      "typescript",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
    ],
  },
  glint: {
    scripts: {
      "lint:types": "glint",
    },
    deps: ["@glint/core"],
  },
};

export default async function run() {
  let pkgManager = await project.getPackageManager();

  assert(pkgManager === "pnpm", `Only pnpm is supported`);

  for (let workspace of await project.getWorkspaces()) {
    await project.inWorkspace(workspace, async () => {
      // is root?
      // -> update workflow files
      // -> add turbo
      // -> setup turbo.json
      // -> setup root package.json
      // -> remove all lint scripts except lint and lint:fix
      //
      // each workspace:
      // - update .prettierrc.cjs and .eslintrc.cjs
      //    - support gjs, etc etc
      //    - expose the primitives for each of the linting styles
      // - has eslint?
      //  -> add lint:js, lint:js:fix
      // - has prettier?
      //  -> etc
      // - has templates?
      // - has styles?
      // - has types?
      // - has glint?
      //
      // is ember?
      // -> is app?
      //   -> call to turbo before running start, test, etc
      // -> is addon?
      //   -> call to turbo before running start, build, etc
      //   -> setup ember-try to use turbo for try scenarios
      // -> is v2 addon?
      //   -> call to turbo before running start, build, etc
      // -> is test app?
      //   -> setup ember-try to use turbo for try scenarios
    });
  }
}

run.path = __dirname;
