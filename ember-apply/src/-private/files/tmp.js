import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/**
 * Creates a new tmp directory in the system tmp folder
 * with sufficient variation.
 *
 * @param {string} prefix optionally change the prefix used for generating the tmp folder
 *
 * @returns {Promise<string>} the location of the new tmp folder
 */
export async function mktmp(prefix = 'ember-apply') {
  const time = performance.now();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `${prefix}-${time}_`));

  return tmpDir;
}
