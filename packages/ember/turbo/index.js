// @ts-check
import { files, html, packageJson, project, ember } from "ember-apply";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

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
