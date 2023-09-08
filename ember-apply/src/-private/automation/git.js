import { execaCommand } from 'execa';

/**
 * @param {string} branchName
 * @param {{ cwd?: string; fromBranch?: string }} [userOptions]
 */
export async function switchTo(branchName, userOptions) {
  let { cwd, fromBranch } = userOptions || {};
  let options = compact({ cwd });

  if (fromBranch) {
    await execaCommand(`git switch -c ${branchName} "${fromBranch}"`, options);

    return;
  }

  await execaCommand(`git checkout ${branchName}`, options);
}

/**
 * @param {string} remoteName
 * @param {string} [cwd]
 */
export async function fetchRemote(remoteName, cwd) {
  let options = compact({ cwd });

  await execaCommand(`git fetch ${remoteName}`, options);
}

/**
 * @param {string} [cwd]
 */
export async function isClean(cwd) {
  let options = compact({ cwd });

  let { stdout } = await execaCommand(`git status --porcelain`, options);

  let isDirty = stdout.length > 0;

  return !isDirty;
}

/**
 * @param {Record<string, string | undefined | null>} options
 */
function compact(options) {
  /** @type {Record<string, string>} */
  let result = {};

  for (let [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }

  return result;
}
