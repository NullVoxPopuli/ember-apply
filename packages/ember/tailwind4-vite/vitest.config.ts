/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    testTimeout: 90_000,
    hookTimeout: 30_000,
  },
});
