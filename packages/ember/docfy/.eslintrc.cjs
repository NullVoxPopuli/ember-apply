'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.nodeTS();

module.exports = {
  ...config,
  overrides: [...config.overrides],
};
