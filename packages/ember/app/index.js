
// @ts-check
import {files } from 'ember-apply';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';

export default async function run() {
  await files.applyFolder(path.join(__dirname, 'files'), '.');
}


// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

run.path = __dirname;
