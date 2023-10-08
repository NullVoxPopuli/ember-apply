import assert from 'node:assert';
import path from 'node:path';
import url from 'node:url';

import { packageJson,project } from 'ember-apply';
import { execa } from 'execa';

export default async function run() {
  await hasVolta();

  let workspaces = await project.getWorkspaces();
  let root = await project.workspaceRoot();

  for (let workspace of workspaces) {
    let manifest = await packageJson.read(workspace);

    if (workspace === root && !manifest.volta) {
      await execa('volta', ['pin', 'node'], { cwd: root }); 
      continue;
    }

    let extendsTarget = path.relative(root, workspace);

    await packageJson.modify(json => {
      json.volta = { extends: extendsTarget };
    }, workspace);
  }
}

async function hasVolta() {
  let result = await execa('which', ['volta']);

  assert(result.exitCode === 0, `volta was not found on this system. Please install volta at https://volta.sh`);
}


// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

run.path = __dirname;
