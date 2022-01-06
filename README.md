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
