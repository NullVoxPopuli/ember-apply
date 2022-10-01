# How To Contribute

## Installation

* `git clone <repository-url>`
* `cd ember-apply`
* `pnpm install`

## Linting

* `pnpm lint`

## Running tests

* `pnpm test`


## Local Debugging

If you have an ember app (or any project) elsewhere on your file system, you'll want to invoke ember-apply via:

```shell
node \
  ../../path/to/ember-apply/packages/ember-apply/src/cli/index.js \
  ../../path/to/your/applyable
```
