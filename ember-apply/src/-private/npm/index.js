import latestVersion from 'latest-version';

/**
 * For a list of dependencies, return an object of [depName] => version
 *
 * Uses [`latest-version`](https://www.npmjs.com/package/latest-version)
 *
 * @param {string[]} deps
 * @param {'^' | '~' | '>=' | '' | string} [ range ] default range is ^
 */
export async function getLatest(deps, range = '^') {
  /** @type {Record<string, string>} */
  let depsWithVersions = {};

  await Promise.all(
    deps.map(async (dep) => {
      let version = await latestVersion(dep);

      depsWithVersions[dep] = `${range}${version}`;
    }),
  );

  return depsWithVersions;
}
