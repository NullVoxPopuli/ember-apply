# ember-apply

_Automatic integration and configuration from the community._

This is a collection of recommended configurations provided via
transformation (codemods and other utilities) that work both on
existing apps as well as new apps to help make setting things
up a bit easier.

## Usage

```shell
npx ember-apply <feature-name>
```

where `<feature-name>` is one of the following:

### `tailwind`

```shell
npx ember-apply tailwind
```

_Automates the steps from [Tailwind's installation docs](https://tailwindcss.com/docs/installation)_

Known working capabilities:
 - JIT
 - Rebuilding during development

### `ssr`

implementation tbd (pr's welcome!)

```shell
npx ember-apply ssr
```

Known working capabilities:
 - tbd

## Adding a new applyable

- clone this repository
- create a `applyables/<your-applyable>/index.js` file
- have a function exported as the default export.
  within this function, you may import form `ember-apply` to use any of the utility functions.
  the only argument passed to this function is the working directory `npx ember-apply` was invoked from.
  how the `<your-applyable>` folder is managed is totally up to whomever implements and maintains that code.
