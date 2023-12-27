/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    testTimeout: 60_000,
    hookTimeout: 30_000,
  },
});
