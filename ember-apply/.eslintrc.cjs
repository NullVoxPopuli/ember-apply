"use strict";

const { configs } = require("@nullvoxpopuli/eslint-configs");

const config = configs.node();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ["tests/**/*.{ts,js}"],
      rules: {
        "n/no-missing-import": ["off"],
      },
    },
  ],
};
