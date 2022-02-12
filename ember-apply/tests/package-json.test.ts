import { describe, expect, test } from 'vitest';

// import { packageJson } from '../src';
import { satisfies } from '../src/-private/package-json/semver-satisfies';

describe('package-json', () => {
  describe('satisfies', () => {
    test('it works', () => {
      expect(satisfies('1.0.0', '^1.0.0')).toBe(true);
    });
  });
});
