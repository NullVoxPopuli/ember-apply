// @ts-check

/**
 * Public API for the project namespace
 */
export { gitIgnore, gitRoot } from './git.js';
export {
  getPackageManager,
  getPackageManagerLockfile,
} from './package-manager.js';
export { renovateLite } from './renovate-lite.js';
export {
  eachWorkspace,
  getWorkspaces,
  inWorkspace,
  workspaceRoot,
} from './workspace.js';
