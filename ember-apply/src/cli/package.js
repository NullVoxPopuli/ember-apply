/**
 * @param {string} name
 */
export function isInvalidPackageName(name) {
  return name.startsWith('/') || name.includes('../');
}

/**
 * @param {any} packageInfo
 */
export function urlFor(packageInfo) {
  if (!packageInfo) return;

  let { bugs, homepage, repository } = packageInfo;

  return bugs?.url || homepage || repoUrlFor(repository);
}

/**
 * @param {string | any} repositoryEntry
 */
function repoUrlFor(repositoryEntry) {
  if (!repositoryEntry) return;

  if (typeof repositoryEntry === 'string') {
    return repositoryEntry;
  }

  return repositoryEntry.url;
}
