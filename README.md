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

### any package published as ESM with a default export

when using a package name for the `<feature-name>`, an ESM version of the package
will attempt to be loaded and used, invoking the default export.
```shell
npx ember-apply @scope/feature-name
```

## Adding a new applyable

- clone this repository
- create a `applyables/<your-applyable>/index.js` file
- have a function exported as the default export.
  within this function, you may import form `ember-apply` to use any of the utility functions.
  the only argument passed to this function is the working directory `npx ember-apply` was invoked from.
  how the `<your-applyable>` folder is managed is totally up to whomever implements and maintains that code.

### For Transforming JS

[JSCodeShift](https://github.com/facebook/jscodeshift) is used

### For Transforming Ember Templates

[ember-template-recast](https://github.com/ember-template-lint/ember-template-recast) is used

### For Transforming HTML

[rehype](https://github.com/rehypejs/rehype) is used

## Public API

While these public APIs aren't "needed", and could indeed be used with ember's blueprint system, or some other ecosystem

### `transformScript`
### `transformTemplate`
### `transformHTML`
### `addHTML`
### `gitIgnore`
### `addScript`
### `addScripts`
### `applyFolder`
### `copyFileTo`


## Related Projects

- [preset](https://github.com/preset/preset)
    GOAL (tbd): be compatible with `npx apply`

    - `preset` does not provide codemodding tools, but
      it does provide basic pattern-based transforming
      utilities, so it's a solid option. It also does
      not have built-in support for template transforms.
    - currently, `preset` forces the install of `esbuild` which fails due to having the security feature `ignore-scripts` enabled, so `preset` is a non-option for folks who care
      about security. (or who don't mind adding an allow-list for `preset`)

