import fs from 'fs/promises';
import path, { dirname } from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function newTmpDir() {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `ember-apply-${Date.now()}-`));

  return tmpDir;
}

export async function newEmberApp() {
  let dir = await newTmpDir();

  await execa('ember', ['new', 'test-app', '--skip-npm'], {
    cwd: dir,
  });

  return path.join(dir, 'test-app');
}

export async function newEmberAddon() {
  let dir = await newTmpDir();

  await execa('ember', ['addon', 'test-addon', '--skip-npm'], {
    cwd: dir,
  });

  return path.join(dir, 'test-addon');
}

/**
 * @param {string} appPath the app to apply the applyable to
 * @param {string} applyablePath the path to the applyable
 */
export async function apply(appPath, applyablePath) {
  let cli = path.join(__dirname, 'cli/index.js');
  let target = applyablePath.startsWith('@') ? applyablePath : path.resolve(applyablePath);

  await execa('node', [cli, '--verbose', target], {
    cwd: appPath,
    stdio: process.env.DEBUG ? 'inherit' : undefined,
  });
}

/**
 * @param {string} appPath the path to git diff
 */
export async function diffSummary(appPath) {
  let { stdout } = await execa('git', ['diff', '--compact-summary'], {
    cwd: appPath,
  });

  return stdout;
}

/**
 * @typedef {object} DiffOptions
 * @property {boolean} [ignoreVersions]
 *
 * @param {string} appPath the path to git diff
 * @param {DiffOptions} [options]
 */
export async function diff(appPath, options = {}) {
  let { stdout } = await execa('git', ['diff', '--name-only'], { cwd: appPath });

  let files = stdout.split('\n');

  let diff = '';

  for (let filePath of files) {
    if (!filePath) {
      continue;
    }

    if (filePath.endsWith('package.json') && options?.ignoreVersions) {
      let fileBuffer = await fs.readFile(filePath);
      let fileString = fileBuffer.toString();
      let json = JSON.parse(fileString);

      for (let section of [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'engines',
        'volta',
      ]) {
        if (json[section]) {
          json[section] = Object.keys(json[section]);
        }
      }

      diff += `\n${filePath}\n${JSON.stringify(json, null, 2)}\n`;
    }

    // Why is this not easier....
    // let normalCommand =
    //   `git diff ${filePath} ` +
    //   `| sed -n '/^---/!p' ` +
    //   `| sed -n '/^+++/!p' ` +
    //   `| sed -n '/^@@/!p' ` +
    //   `| sed -n '/^index /!p'`;

    let { stdout: fullDiff } = await execa(`git`, ['diff', filePath], { cwd: appPath });

    let shortDiff = fullDiff
      .replace(/^---[^$]+$/, '')
      .replace(/^\+\+\+[^$]+$/, '')
      .replace(/index[^$]+$/, '')
      .replace(/@@[^$]+$/, '');

    diff += shortDiff + '\n';
  }

  return diff;
}
