import { describe, expect, test } from 'vitest';

import { packageJson } from '../src';
import { satisfies } from '../src/-private/package-json/semver-satisfies';

describe('package-json', () => {
  describe('hasDependency', () => {
    test('no version specified', async () => {
      let hasTs = await packageJson.hasDependency('typescript');

      expect(hasTs).toBe(true);
    });

    test('version is specified', async () => {
      let hasTs = await packageJson.hasDependency('typescript', '^5.0.0');

      expect(hasTs).toBe(true);
    });

    test('any version is specified', async () => {
      let hasTs = await packageJson.hasDependency('typescript', '*');

      expect(hasTs).toBe(true);
    });

    test('version does not match', async () => {
      let hasTs = await packageJson.hasDependency('typescript', '^3.0.0');

      expect(hasTs).toBe(false);
    });
  });

  describe('satisfies', () => {
    test('it works', () => {
      expect(satisfies('1.0.0', '^1.0.0')).toBe(true);
    });

    test('can match "any version"', () => {
      expect(satisfies('4.0.0', '*')).toBe(true);
      expect(satisfies('^4.0.0', '*')).toBe(true);
    });
  });
});
