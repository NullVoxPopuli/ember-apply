import { configs } from '@nullvoxpopuli/eslint-configs';

const config = configs.node();

export default {
  ...config,
  overrides: [
    ...config.overrides,
  ]
}
