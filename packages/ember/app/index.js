// @ts-check
import {files } from 'ember-apply';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { intro, text } from '@clack/prompts';
  import { Eta } from "eta/core"
  const eta = new Eta()

export default async function run() {
  intro(`Creating minimal app`);

  // https://github.com/bombshell-dev/clack/tree/main/packages/prompts#readme
  const name = await text({
    message: 'What is the naem of this app?',
    initialValue: 'my-app',
  });

  await files.applyFolder(path.join(import.meta.dirname, 'files'), {
    transform({ contents }) {
      return eta.renderString(contents, { name });
    }
  });
}


// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
