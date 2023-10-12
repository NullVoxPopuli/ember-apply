# ember-apply

## 2.10.2

### Patch Changes

- 05a30f5: Fix declarations by using moduleResolution=bundler during generation

## 2.10.1

### Patch Changes

- 73eaf6e: Fix typo in JSDoc

## 2.10.0

### Minor Changes

- b0ce38a: Support specifying default ranges across dependencies in renovate-lite

## 2.9.0

### Minor Changes

- 577e031: Add renovate lite tool for projects to mass update deps
- 702895f: Add new utils to files for diffing production assets

## 2.8.0

### Minor Changes

- 3e04b19: Support passing jscodeshift options to toSource, for support double vs single quotes during the transform

## 2.7.1

### Patch Changes

- 8595390: when working with package.json files, the keys will be sorted, similar to what npm/yarn/pnpm do when they modify the package.json file

## 2.7.0

### Minor Changes

- e17e820: Add CSS tools, transform, and analyze.

  For example:

  ```js
  import { css } from "ember-apply";

  let transformed = await css.analyze("some/file.css", {
    Once(root) {
      // postcss plugin
    },
  });

  // writes file after applying the plugin
  await css.transform("some/file.css", {
    Once(root) {
      // postcss plugin
    },
  });
  ```

## 2.6.5

### Patch Changes

- fa781fd: Add package.json#exports.types

## 2.6.4

### Patch Changes

- 512ccd7: Add the index.d.ts to the typesVersions entries

## ember-apply [2.6.3](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.6.2...ember-apply@2.6.3) (2023-02-14)

### Bug Fixes

- **types:** add typesDeclarations to package.json ([280a11e](https://github.com/NullVoxPopuli/ember-apply/commit/280a11e62a3b612fa556c19407e47cd140a22929))

## ember-apply [2.6.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.6.1...ember-apply@2.6.2) (2023-02-14)

### Bug Fixes

- **ember-apply:** use correct type for packageJson.modify callback's return type ([0141322](https://github.com/NullVoxPopuli/ember-apply/commit/0141322f3fbe5d106d463a81f6cfbe2289d86da6))

## ember-apply [2.6.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.6.0...ember-apply@2.6.1) (2023-02-12)

### Bug Fixes

- **deps:** update dependency execa to v7 ([81ff757](https://github.com/NullVoxPopuli/ember-apply/commit/81ff757790b0bf1fdc40f92124bc3ef9acff0efc))

# ember-apply [2.6.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.5.2...ember-apply@2.6.0) (2023-01-28)

### Features

- add pnpm support to the workspace utilities ([1094210](https://github.com/NullVoxPopuli/ember-apply/commit/1094210c571a256cdedc50733cc2df010a30d974))

## ember-apply [2.5.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.5.1...ember-apply@2.5.2) (2023-01-06)

### Bug Fixes

- **deps:** update dependency pacote to v15 ([dedc4a5](https://github.com/NullVoxPopuli/ember-apply/commit/dedc4a5aa6a9fc3a63476da2bd7f30c006bb4e6c))

## ember-apply [2.5.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.5.0...ember-apply@2.5.1) (2023-01-06)

### Bug Fixes

- **deps:** update dependency fs-extra to v11 ([9cd4742](https://github.com/NullVoxPopuli/ember-apply/commit/9cd4742a3236cb26b527b39d98c3cc8526be028d))

# ember-apply [2.5.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.4.4...ember-apply@2.5.0) (2023-01-05)

### Features

- **ember-apply:** add analyze method to JS ([864aa45](https://github.com/NullVoxPopuli/ember-apply/commit/864aa45da7647e1a01120c37102781b27aaab810))

## ember-apply [2.4.4](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.4.3...ember-apply@2.4.4) (2022-10-05)

### Bug Fixes

- **deps:** update dependency pacote to v14 ([cad9207](https://github.com/NullVoxPopuli/ember-apply/commit/cad9207fb3ab3f5f78f8508bb52210b024f2e4a3))

## ember-apply [2.4.3](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.4.2...ember-apply@2.4.3) (2022-10-05)

### Bug Fixes

- **deps:** update dependency jscodeshift to ^0.14.0 ([5c43f8f](https://github.com/NullVoxPopuli/ember-apply/commit/5c43f8fe51a930799a2d865a68fe42f06a355985))

## ember-apply [2.4.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.4.1...ember-apply@2.4.2) (2022-10-04)

### Bug Fixes

- **deps:** update dependency latest-version to v7 ([67bc699](https://github.com/NullVoxPopuli/ember-apply/commit/67bc699d312229fb394705d31938545421a7ae2c))

## ember-apply [2.4.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.4.0...ember-apply@2.4.1) (2022-10-02)

### Bug Fixes

- **docs:** improve typedoc-parsing of documentation ([0c3587d](https://github.com/NullVoxPopuli/ember-apply/commit/0c3587d5f0d5599883821d2d41d06a6efe08956f))

# ember-apply [2.4.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.3.3...ember-apply@2.4.0) (2022-10-01)

### Features

- **js:** add ability to override the parser detection ([a05cca8](https://github.com/NullVoxPopuli/ember-apply/commit/a05cca8bde91b57f6533548facabd3dd4736b94c))

## ember-apply [2.3.3](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.3.2...ember-apply@2.3.3) (2022-06-14)

### Bug Fixes

- add type-checking to c.i. so that packages release successfully ([5d6eae8](https://github.com/NullVoxPopuli/ember-apply/commit/5d6eae8e2301a5b2e6647cfb584beb97ea78438f))

## ember-apply [2.3.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.3.1...ember-apply@2.3.2) (2022-06-14)

### Bug Fixes

- don't add ="" to data-embroider-ignore boolean attribute (fix [#353](https://github.com/NullVoxPopuli/ember-apply/issues/353)) ([f6921e3](https://github.com/NullVoxPopuli/ember-apply/commit/f6921e3d1c4f1162821f4439b1a7ba9bce09f8d4))

## ember-apply [2.3.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.3.0...ember-apply@2.3.1) (2022-06-14)

### Bug Fixes

- detect/correct Windows paths (fix [#271](https://github.com/NullVoxPopuli/ember-apply/issues/271)) ([2a2b029](https://github.com/NullVoxPopuli/ember-apply/commit/2a2b029585c61eb3097511b4d9aec936297fd082)), closes [#262](https://github.com/NullVoxPopuli/ember-apply/issues/262)

# ember-apply [2.3.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.2.3...ember-apply@2.3.0) (2022-06-02)

### Features

- **ember:** add deprecation-workflow management utilities ([a71f0c5](https://github.com/NullVoxPopuli/ember-apply/commit/a71f0c559c3c1c03b808e0acf1c17e53028f3ab9))

## ember-apply [2.2.3](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.2.2...ember-apply@2.2.3) (2022-05-02)

### Bug Fixes

- use file:// for module resolution of Windows absolute paths ([426896e](https://github.com/NullVoxPopuli/ember-apply/commit/426896e91e26216e9f25d83cb5dd72b203438446))
- **project:** accommodate Windows paths ([607dfdb](https://github.com/NullVoxPopuli/ember-apply/commit/607dfdb252b32ae053906431b95ed301d5affeea))

## ember-apply [2.2.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.2.1...ember-apply@2.2.2) (2022-04-15)

### Bug Fixes

- **satisfies, packageJson:** allow _===_ comparisons for packageJson comparisons ([433f928](https://github.com/NullVoxPopuli/ember-apply/commit/433f928377606a7a9aff7c61beff11e12add853b))

## ember-apply [2.2.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.2.0...ember-apply@2.2.1) (2022-02-21)

### Bug Fixes

- **ember-apply:** packageJson: protect against missing dependency collections ([9ed4729](https://github.com/NullVoxPopuli/ember-apply/commit/9ed472953dc2c1ddd8482458faf1ac9824feeb21))

# ember-apply [2.2.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.1.1...ember-apply@2.2.0) (2022-02-21)

### Features

- **ember-apply:** add hasPeerDependency ([485374e](https://github.com/NullVoxPopuli/ember-apply/commit/485374e6326df8a5348be077d35309e91a667c53))

## ember-apply [2.1.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.1.0...ember-apply@2.1.1) (2022-02-17)

### Bug Fixes

- remove references to autoprefixer and postcss ([b50eebc](https://github.com/NullVoxPopuli/ember-apply/commit/b50eebc2fd106ee9c798297e9e6464030f75539f))

# ember-apply [2.1.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.0.4...ember-apply@2.1.0) (2022-02-16)

### Features

- **packageJson:** add remone\*Dependencies methods ([9c2ff3e](https://github.com/NullVoxPopuli/ember-apply/commit/9c2ff3e643974ab85d23d26a30021fc653f5c535))

## ember-apply [2.0.4](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.0.3...ember-apply@2.0.4) (2022-02-15)

### Bug Fixes

- **deps:** update dependency pacote to v13 ([8f8a4e3](https://github.com/NullVoxPopuli/ember-apply/commit/8f8a4e38ca544ef2c6fbc370f0edff07f34caecf))

## ember-apply [2.0.3](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.0.2...ember-apply@2.0.3) (2022-02-12)

### Bug Fixes

- **ember-apply:** dependency version checking fixed for range vs range check ([2169f3e](https://github.com/NullVoxPopuli/ember-apply/commit/2169f3ed1e5199ee546e112ecc8d5c6756abfddb))

## ember-apply [2.0.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.0.1...ember-apply@2.0.2) (2022-02-12)

### Bug Fixes

- **ember-apply:** ensure dependency version checking works ([9b68419](https://github.com/NullVoxPopuli/ember-apply/commit/9b684194b82fc6f5b8ff90e19d6d9ce35809e03c))

## ember-apply [2.0.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@2.0.0...ember-apply@2.0.1) (2022-02-12)

### Bug Fixes

- **ember-apply:** add types to ember-apply package ([dccee29](https://github.com/NullVoxPopuli/ember-apply/commit/dccee29f45fd3c4e11dfbc262d2794c4689d2f25))

# ember-apply [2.0.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@1.4.2...ember-apply@2.0.0) (2022-02-12)

### Bug Fixes

- **ember-apply:** re-add readme ([f30afda](https://github.com/NullVoxPopuli/ember-apply/commit/f30afda737d3a401e25cd8eb4c6cab5e09f3c716))
- **html, transform:** move from rehype back to posthtml ([5ae8ea4](https://github.com/NullVoxPopuli/ember-apply/commit/5ae8ea4d08f12ae1afb63454982912f914a0909d))
- **npm-fallback:** add flags to npm install to _make_ it work ([ca7eacc](https://github.com/NullVoxPopuli/ember-apply/commit/ca7eaccf53efd76f5e94aed1ac238e7efb2c0989))
- **project:** add tests (and fixes) for workspace iteration ([5560d95](https://github.com/NullVoxPopuli/ember-apply/commit/5560d95bd193950f15151114d42fb1c267772d9d))

### Features

- **ember-apply:** add cwd to support to all package-json utilities ([1c85876](https://github.com/NullVoxPopuli/ember-apply/commit/1c85876ec1b5b37ca3c164ffffbc7392c8f4dd76))
- **ember-apply:** print the issue report URL before applying ([03db4db](https://github.com/NullVoxPopuli/ember-apply/commit/03db4dbc9701fb2072acbbc768d771e331af30b5))

### BREAKING CHANGES

- **html, transform:** turns out rehype isn't a good fit for codemods
  rehype's primary use case is generated code -> generated code.
  We need userland code -> userland code, so maintaining formatting is
  important.

# ember-apply [2.0.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply@1.4.2...ember-apply@2.0.0) (2022-02-12)

### Bug Fixes

- **ember-apply:** re-add readme ([f30afda](https://github.com/NullVoxPopuli/ember-apply/commit/f30afda737d3a401e25cd8eb4c6cab5e09f3c716))
- **html, transform:** move from rehype back to posthtml ([5ae8ea4](https://github.com/NullVoxPopuli/ember-apply/commit/5ae8ea4d08f12ae1afb63454982912f914a0909d))
- **npm-fallback:** add flags to npm install to _make_ it work ([ca7eacc](https://github.com/NullVoxPopuli/ember-apply/commit/ca7eaccf53efd76f5e94aed1ac238e7efb2c0989))
- **project:** add tests (and fixes) for workspace iteration ([5560d95](https://github.com/NullVoxPopuli/ember-apply/commit/5560d95bd193950f15151114d42fb1c267772d9d))

### Features

- **ember-apply:** add cwd to support to all package-json utilities ([1c85876](https://github.com/NullVoxPopuli/ember-apply/commit/1c85876ec1b5b37ca3c164ffffbc7392c8f4dd76))
- **ember-apply:** print the issue report URL before applying ([03db4db](https://github.com/NullVoxPopuli/ember-apply/commit/03db4dbc9701fb2072acbbc768d771e331af30b5))

### BREAKING CHANGES

- **html, transform:** turns out rehype isn't a good fit for codemods
  rehype's primary use case is generated code -> generated code.
  We need userland code -> userland code, so maintaining formatting is
  important.

# [ember-apply-v2.1.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v2.0.1...ember-apply-v2.1.0) (2022-01-23)

### Bug Fixes

- **npm-fallback:** add flags to npm install to _make_ it work ([ca7eacc](https://github.com/NullVoxPopuli/ember-apply/commit/ca7eaccf53efd76f5e94aed1ac238e7efb2c0989))

### Features

- **ember-apply:** print the issue report URL before applying ([03db4db](https://github.com/NullVoxPopuli/ember-apply/commit/03db4dbc9701fb2072acbbc768d771e331af30b5))

# [ember-apply-v2.0.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v2.0.0...ember-apply-v2.0.1) (2022-01-23)

### Bug Fixes

- **ember-apply:** re-add readme ([f30afda](https://github.com/NullVoxPopuli/ember-apply/commit/f30afda737d3a401e25cd8eb4c6cab5e09f3c716))

# [ember-apply-v2.0.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v1.4.2...ember-apply-v2.0.0) (2022-01-23)

### Bug Fixes

- **html, transform:** move from rehype back to posthtml ([5ae8ea4](https://github.com/NullVoxPopuli/ember-apply/commit/5ae8ea4d08f12ae1afb63454982912f914a0909d))

### BREAKING CHANGES

- **html, transform:** turns out rehype isn't a good fit for codemods
  rehype's primary use case is generated code -> generated code.
  We need userland code -> userland code, so maintaining formatting is
  important.

# [ember-apply-v1.4.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v1.4.1...ember-apply-v1.4.2) (2022-01-17)

### Bug Fixes

- **internal:** remove trailing slash from package URLs ([991c35a](https://github.com/NullVoxPopuli/ember-apply/commit/991c35a6c89fff9522a53268a7e6f83deaa69e7c))

# [ember-apply-v1.4.1](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.4.0...ember-apply-v1.4.1) (2022-01-17)

### Bug Fixes

- **internal:** forgot to make an adjustment for publishing ([07a6490](https://github.com/NullVoxPopuli/ember-apply//commit/07a6490cc6b81a4aec79926690038df4d2908db6))

# [ember-apply-v1.4.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.3.0...ember-apply-v1.4.0) (2022-01-14)

### Features

- **ember-apply:** applyFolder improvements ([07bb90e](https://github.com/NullVoxPopuli/ember-apply//commit/07bb90ed90eabc3c5a15b728c193e4e9d8b722bd))

# [ember-apply-v1.3.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.2.0...ember-apply-v1.3.0) (2022-01-14)

### Features

- **ember-apply:** add spinners ([daf6037](https://github.com/NullVoxPopuli/ember-apply//commit/daf6037c985f65688110a2e6e9f9b1570cc0d8b5))

# [ember-apply-v1.2.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.1.0...ember-apply-v1.2.0) (2022-01-14)

### Bug Fixes

- **ember-apply:** declare engines support ([d448a13](https://github.com/NullVoxPopuli/ember-apply//commit/d448a13615a93f66710825d694a940b6bfffa479))

### Features

- **ember-apply:** support installing from npm package ref ([3800100](https://github.com/NullVoxPopuli/ember-apply//commit/38001000754fa7629a3e0ef49c1331c5d31f0d75))

# [ember-apply-v1.1.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.0.1...ember-apply-v1.1.0) (2022-01-14)

### Features

- use yargs for a better CLI experience ([faf7551](https://github.com/NullVoxPopuli/ember-apply//commit/faf7551b64da3e28dd5dc0f40f2d90667ee002e2))

# [ember-apply-v1.0.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v1.0.0...ember-apply-v1.0.1) (2022-01-13)

### Bug Fixes

- **ember-apply:** local paths are always relative to cwd ([37889df](https://github.com/NullVoxPopuli/ember-apply/commit/37889dfccb17e7224921ebf8b8720b8ba6bc894d))

# ember-apply-v1.0.0 (2022-01-13)

### Bug Fixes

- **npm:** actually publish files ([b502751](https://github.com/NullVoxPopuli/ember-apply/commit/b502751f46fc126ad65be7092121661228a5cebf))

### chore

- prep for release ([ee29aeb](https://github.com/NullVoxPopuli/ember-apply/commit/ee29aeb60e9cd2b6c8204591eafd88ad58bfccd1))

### BREAKING CHANGES

- initial release

# ember-apply-v1.0.0 (2022-01-13)

### chore

- prep for release ([ee29aeb](https://github.com/NullVoxPopuli/ember-apply/commit/ee29aeb60e9cd2b6c8204591eafd88ad58bfccd1))

### BREAKING CHANGES

- initial release
