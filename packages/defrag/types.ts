
import type { Package } from '@manypkg/get-packages';

export type Manifest = Package['packageJson'];

export interface Config {
  'write-as': 'pinned' | 'semver';
  'update-range': {
    // list of names or globs to match packages against
    '~': string[]
    '^': string[]
    // '>=': string[]
  }
}
