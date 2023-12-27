import { packageJson } from 'ember-apply';

export async function getModuleName() {
  let manifest = await packageJson.read();

  // TODO: or config/environment.js something _for some reason_?!?!?!?!
  return manifest.name;
}
