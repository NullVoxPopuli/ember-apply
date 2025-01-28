# ember-apply
[![npm version](https://badge.fury.io/js/ember-apply.svg)](https://badge.fury.io/js/ember-apply)
[![CI](https://github.com/NullVoxPopuli/ember-apply/actions/workflows/ci.yml/badge.svg)](https://github.com/NullVoxPopuli/ember-apply/actions/workflows/ci.yml)


_Automatic integration and configuration from the community._

See the [Documentation](https://ember-apply.pages.dev/modules).


This is a framework and ecosystem agnostic collection of recommended configurations,
applied via automation, that is compatible with any kind of project, new and old.

Individual configurations may have conventions specific to a an ecosystem, but `ember-apply`,
itself, can be used with [Svelte](http://svelte.dev/), [React](https://reactjs.org/), or
whatever you want. The tools provided by `ember-apply` only require Node 16+.

Maybe most importantly, is that `ember-apply` can be used for any tool that wishes
to use high-level project-management and transformation utilities.
See [#Public API](https://ember-apply.pages.dev/modules).


![npm (tag)](https://img.shields.io/npm/v/@ember-apply/tailwind/latest?label=%40ember-apply%2Ftailwind)
![npm (tag)](https://img.shields.io/npm/v/@ember-apply/embroider/latest?label=%40ember-apply%2Fembroider)


_NOTE:_ this package is a slightly experimental and prone to some API or organizational changes -- but is committed to strictly following semver.

## Usage

```shell
npx ember-apply <feature-name>
```

where `<feature-name>` is one of the options under [#Features](#features)

## Compatibility

* Node 16 +
* ESM

## Internal applyables

### `typescript`

```shell
npx ember-apply typescript
```

_Automates setting up TypeScript for your V1 Addon or App._
- correct dependencies
- correct types 
- correct configs

### `volta`

```shell
npx ember-apply volta
```

_Automates setting up [volta](https://volta.sh/) in a project, monorepo or solorepo_.
- root package.json defines node version
- if monorepo, all other packages extend from the root package.json

### `tailwind`

```shell
npx ember-apply tailwind
```

_Automates the steps from [Tailwind's installation docs](https://tailwindcss.com/docs/installation)_

Known working capabilities:
 - JIT
 - Rebuilding during development

**Assumptions**
- entrypoint for your app is located at `app/index.html`
- entrypoint for your tests is located at `tests/index.html`
- tailwind files are placed in `config/tailwind/`

### `tailwind-webpack`

```shell
npx ember-apply tailwind-webpack
```

_Automates the official [Tailwind + Ember.js guide](https://tailwindcss.com/docs/guides/emberjs)_

- Instead of placing `postcss.config.js` and `tailwind.config.js` into the project root, it places them to `config/` directory.
- Does not need any special command for building tailwind styles they will be built (and watched) together with `npm start`.

### `tailwind3-vite`

```shell
npx ember-apply tailwind3-vite
```

_Automates the official [Tailwind + Vite guide](https://tailwindcss.com/docs/guides/vite) so that it's compatible with [embroider-build/app-blueprint](https://github.com/embroider-build/app-blueprint)_

### `embroider`

```shell
npx ember-apply embroider
```

_Automates the embroider migration from the classic ember build system for maximum-compatibility mode_.
See the [Embroider docs](https://github.com/embroider-build/embroider/)

### `ssr`

implementation tbd (pr's welcome!)

```shell
npx ember-apply ssr
```

Known working capabilities:
 - tbd

## External applyables

- [apply-gts](https://github.com/tcarterjr/apply-gts) - Automates the steps for adding gjs/gts & Glint to an existing Ember app.

## Any package with as ESM with a default export

when using a package name for the `<feature-name>`, an ESM version of the package
will attempt to be loaded and used, invoking the default export.

```shell
npx ember-apply @scope/feature-name
```

Local scripts may also be used. An example of this is maybe in a private monorepo
where some scripts or packages aren't published to npm.

```shell
npx ember-apply ../../path/to/some/script.js # ESM required
# or
npx ember-apply ../../path/to/some/script.mjs
```

## Adding a new applyable to this repository

- clone this repository
- create a `packages/<ecosystem>/<feature>/index.js` file
  examples:
   - `packages/ember/tailwind/index.js`
   - `packages/sveltekit/tailwind/index.js`
- have a function exported as the default export.
  within this function, you may import form `ember-apply` to use any of the utility functions.
  the only argument passed to this function is the working directory `npx ember-apply` was invoked from.
  how the `<your-applyable>` folder is managed is totally up to whomever implements and maintains that code.

### For Transforming JS

[JSCodeShift](https://github.com/facebook/jscodeshift) is used

### For Transforming Ember Templates

[ember-template-recast](https://github.com/ember-template-lint/ember-template-recast) is used

### For Transforming HTML

[posthtml](https://github.com/posthtml/posthtml) is used


## Related Projects

- [preset](https://github.com/preset/preset)
    GOAL (tbd): be compatible with `npx apply`

    - `preset` does not provide codemodding tools, but
      it does provide basic pattern-based transforming
      utilities, so it's a solid option. It also does
      not have built-in support for template transforms.
    - currently, `preset` forces the install of `esbuild` which fails due to having the security feature `ignore-scripts` enabled, so `preset` is a non-option for folks who care
      about security. (or who don't mind adding an allow-list for `preset`)

