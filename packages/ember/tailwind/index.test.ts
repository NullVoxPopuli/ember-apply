import { describe, expect, it } from 'vitest';

import { default as tailwind } from './index';

describe('tailwind', () => {
  it('default export exists', () => {
    expect(typeof tailwind).toEqual('function');
  });
});
