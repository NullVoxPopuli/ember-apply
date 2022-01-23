# [ember-apply-v2.0.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v2.0.0...ember-apply-v2.0.1) (2022-01-23)


### Bug Fixes

* **ember-apply:** re-add readme ([f30afda](https://github.com/NullVoxPopuli/ember-apply/commit/f30afda737d3a401e25cd8eb4c6cab5e09f3c716))

# [ember-apply-v2.0.0](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v1.4.2...ember-apply-v2.0.0) (2022-01-23)


### Bug Fixes

* **html, transform:** move from rehype back to posthtml ([5ae8ea4](https://github.com/NullVoxPopuli/ember-apply/commit/5ae8ea4d08f12ae1afb63454982912f914a0909d))


### BREAKING CHANGES

* **html, transform:** turns out rehype isn't a good fit for codemods
rehype's primary use case is generated code -> generated code.
We need userland code -> userland code, so maintaining formatting is
important.

# [ember-apply-v1.4.2](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v1.4.1...ember-apply-v1.4.2) (2022-01-17)


### Bug Fixes

* **internal:** remove trailing slash from package URLs ([991c35a](https://github.com/NullVoxPopuli/ember-apply/commit/991c35a6c89fff9522a53268a7e6f83deaa69e7c))

# [ember-apply-v1.4.1](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.4.0...ember-apply-v1.4.1) (2022-01-17)


### Bug Fixes

* **internal:** forgot to make an adjustment for publishing ([07a6490](https://github.com/NullVoxPopuli/ember-apply//commit/07a6490cc6b81a4aec79926690038df4d2908db6))

# [ember-apply-v1.4.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.3.0...ember-apply-v1.4.0) (2022-01-14)


### Features

* **ember-apply:** applyFolder improvements ([07bb90e](https://github.com/NullVoxPopuli/ember-apply//commit/07bb90ed90eabc3c5a15b728c193e4e9d8b722bd))

# [ember-apply-v1.3.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.2.0...ember-apply-v1.3.0) (2022-01-14)


### Features

* **ember-apply:** add spinners ([daf6037](https://github.com/NullVoxPopuli/ember-apply//commit/daf6037c985f65688110a2e6e9f9b1570cc0d8b5))

# [ember-apply-v1.2.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.1.0...ember-apply-v1.2.0) (2022-01-14)


### Bug Fixes

* **ember-apply:** declare engines support ([d448a13](https://github.com/NullVoxPopuli/ember-apply//commit/d448a13615a93f66710825d694a940b6bfffa479))


### Features

* **ember-apply:** support installing from npm package ref ([3800100](https://github.com/NullVoxPopuli/ember-apply//commit/38001000754fa7629a3e0ef49c1331c5d31f0d75))

# [ember-apply-v1.1.0](https://github.com/NullVoxPopuli/ember-apply//compare/ember-apply-v1.0.1...ember-apply-v1.1.0) (2022-01-14)


### Features

* use yargs for a better CLI experience ([faf7551](https://github.com/NullVoxPopuli/ember-apply//commit/faf7551b64da3e28dd5dc0f40f2d90667ee002e2))

# [ember-apply-v1.0.1](https://github.com/NullVoxPopuli/ember-apply/compare/ember-apply-v1.0.0...ember-apply-v1.0.1) (2022-01-13)


### Bug Fixes

* **ember-apply:** local paths are always relative to cwd ([37889df](https://github.com/NullVoxPopuli/ember-apply/commit/37889dfccb17e7224921ebf8b8720b8ba6bc894d))

# ember-apply-v1.0.0 (2022-01-13)


### Bug Fixes

* **npm:** actually publish files ([b502751](https://github.com/NullVoxPopuli/ember-apply/commit/b502751f46fc126ad65be7092121661228a5cebf))


### chore

* prep for release ([ee29aeb](https://github.com/NullVoxPopuli/ember-apply/commit/ee29aeb60e9cd2b6c8204591eafd88ad58bfccd1))


### BREAKING CHANGES

* initial release

# ember-apply-v1.0.0 (2022-01-13)


### chore

* prep for release ([ee29aeb](https://github.com/NullVoxPopuli/ember-apply/commit/ee29aeb60e9cd2b6c8204591eafd88ad58bfccd1))


### BREAKING CHANGES

* initial release
