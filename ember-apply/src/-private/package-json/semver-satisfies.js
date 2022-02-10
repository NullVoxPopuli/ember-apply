import semver from 'semver';

/**
 * Improved semver `satisfies` function.
 * The original `semver.satisfies` function does not handle
 * when the passed `version` is a pre-release version.
 *
 * The `satisfies` built-in `includePrelease` option is not
 * able to handle the `version` being a pre-release version,
 * it only checks the `range`.
 *
 * See https://www.npmjs.com/package/semver
 * for the behavior of the original function.
 *
 * @param {string} version
 * @param {string} range
 * @returns {boolean}
 */
export function satisfies(version, range) {
  let satisfied = semver.satisfies(version, range, {
    includePrerelease: true,
  });

  if (version === undefined || version === '*') {
    return true;
  }

  // if a pre-release version is used, we need to check that separate,
  // because `includePrerelease` only applies to the range argument of `range`.
  if (!satisfied) {
    let parsedVersion = semver.parse(version);

    if (parsedVersion && parsedVersion.prerelease.length > 0) {
      let { major, minor, patch } = parsedVersion;
      let bareVersion = `${major}.${minor}.${patch}`;

      return semver.satisfies(bareVersion, range, {
        includePrerelease: true,
      });
    }
  }

  return satisfied;
}
