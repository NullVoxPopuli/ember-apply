# @ember-apply/tailwind-webpack

## 1.0.1

### Patch Changes

- d39fb66: Move tailwind config files in to `<project>/config` instead of `<project>/app/config`
- 2b83434: Fixes: #495

  - Make some check/throw so that the logic doesn ot just silently fail, but gives reasonable guidance.
  - Make sure that the import statement is inserted correctly.
  - We now assume the need to have embroider ready project.
  - We throw information if that is not adhered to.
  - Changed from HTML parser (why did I do that?) to jscodeshift one.
  - We throw when there is already `packagerOptions` defined.

## 1.0.0

### Major Changes

- c7208ec: Initial relase of webpack-integrated Tailwind3+Jit configruation, following Tailwind's Ember documentation
