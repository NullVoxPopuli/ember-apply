# Changelog






## Release (2026-01-23)

* ember-apply 2.17.0 (minor)
* @ember-apply/minimal-app 0.1.1 (patch)

#### :rocket: Enhancement
* `ember-apply`
  * [#645](https://github.com/NullVoxPopuli/ember-apply/pull/645) files.applyFolder should allow passing excludes and default to excluding node_modules ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#642](https://github.com/NullVoxPopuli/ember-apply/pull/642) Prettier-the-tsconfig output ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* `@ember-apply/minimal-app`
  * [#623](https://github.com/NullVoxPopuli/ember-apply/pull/623) typo ([@johanrd](https://github.com/johanrd))

#### Committers: 2
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@johanrd](https://github.com/johanrd)

## Release (2025-10-02)

* ember-apply 2.16.0 (minor)
* @ember-apply/minimal-app 0.1.0 (minor)

#### :rocket: Enhancement
* `ember-apply`, `@ember-apply/minimal-app`
  * [#621](https://github.com/NullVoxPopuli/ember-apply/pull/621) Add minimal ember app, and prepare for layering parts of a blueprint ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-apply`
  * [#589](https://github.com/NullVoxPopuli/ember-apply/pull/589) Terminal utils ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `@ember-apply/minimal-app`
  * [#622](https://github.com/NullVoxPopuli/ember-apply/pull/622) Set starting version for minimal app ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-08-20)

ember-apply 2.15.3 (patch)
@ember-apply/tailwind4-vite 1.1.3 (patch)

#### :bug: Bug Fix
* `ember-apply`, `@ember-apply/tailwind4-vite`
  * [#616](https://github.com/NullVoxPopuli/ember-apply/pull/616) Revert "move vite tailwind import index.html to app.ts" ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#612](https://github.com/NullVoxPopuli/ember-apply/pull/612) Try to fix API docs deploy (silly cloudflare) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#610](https://github.com/NullVoxPopuli/ember-apply/pull/610) Split out tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-07-19)

ember-apply 2.15.2 (patch)
@ember-apply/tailwind4-vite 1.1.2 (patch)

#### :bug: Bug Fix
* `ember-apply`, `@ember-apply/tailwind4-vite`
  * [#609](https://github.com/NullVoxPopuli/ember-apply/pull/609) Fix tailwind4-vite ([@tcjr](https://github.com/tcjr))

#### Committers: 1
- Tom Carter ([@tcjr](https://github.com/tcjr))

## Release (2025-06-30)

ember-apply 2.15.1 (patch)
@ember-apply/embroider 1.2.1 (patch)
@ember-apply/tailwind 2.3.1 (patch)
@ember-apply/tailwind-webpack 1.2.1 (patch)
@ember-apply/tailwind3-vite 2.0.1 (patch)
@ember-apply/tailwind4-vite 1.1.1 (patch)
@ember-apply/typescript 1.4.1 (patch)
@ember-apply/volta 2.0.7 (patch)

#### :bug: Bug Fix
* `ember-apply`, `@ember-apply/embroider`, `@ember-apply/tailwind-webpack`, `@ember-apply/tailwind`, `@ember-apply/tailwind3-vite`, `@ember-apply/tailwind4-vite`, `@ember-apply/typescript`, `@ember-apply/volta`
  * [#606](https://github.com/NullVoxPopuli/ember-apply/pull/606) Fix for vite tailwind4 ([@evoactivity](https://github.com/evoactivity))

#### Committers: 1
- Liam Potter ([@evoactivity](https://github.com/evoactivity))

## Release (2025-01-29)

ember-apply 2.15.0 (minor)
@ember-apply/tailwind3-vite 2.0.0 (major)
@ember-apply/tailwind4-vite 1.1.0 (minor)

#### :boom: Breaking Change
* `@ember-apply/tailwind3-vite`
  * [#590](https://github.com/NullVoxPopuli/ember-apply/pull/590) feat: Rename tailwind-vite to tailwind3-vite ([@MichalBryxi](https://github.com/MichalBryxi))

#### :rocket: Enhancement
* `ember-apply`, `@ember-apply/tailwind4-vite`
  * [#591](https://github.com/NullVoxPopuli/ember-apply/pull/591) tailwind4-vite ([@MichalBryxi](https://github.com/MichalBryxi))
* Other
  * [#579](https://github.com/NullVoxPopuli/ember-apply/pull/579) feat: Basic tailwind-vite applyable ([@MichalBryxi](https://github.com/MichalBryxi))

#### :bug: Bug Fix
* `@ember-apply/tailwind3-vite`
  * [#594](https://github.com/NullVoxPopuli/ember-apply/pull/594) fix: tailwind3-vite works ([@MichalBryxi](https://github.com/MichalBryxi))

#### :memo: Documentation
* [#592](https://github.com/NullVoxPopuli/ember-apply/pull/592) docs: tailwind3-vite reference ([@MichalBryxi](https://github.com/MichalBryxi))

#### Committers: 1
- Michal Bryxí ([@MichalBryxi](https://github.com/MichalBryxi))

## Release (2025-01-22)

ember-apply 2.14.0 (minor)
@ember-apply/embroider 1.2.0 (minor)
@ember-apply/tailwind 2.3.0 (minor)
@ember-apply/tailwind-webpack 1.2.0 (minor)
@ember-apply/typescript 1.4.0 (minor)

#### :rocket: Enhancement
* `ember-apply`, `docs`, `@ember-apply/embroider`, `@ember-apply/tailwind-webpack`, `@ember-apply/tailwind`, `@ember-apply/typescript`
  * [#581](https://github.com/NullVoxPopuli/ember-apply/pull/581) Add tsconfig utilities ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* [#560](https://github.com/NullVoxPopuli/ember-apply/pull/560) docs: Applyable organisation ([@MichalBryxi](https://github.com/MichalBryxi))
* [#556](https://github.com/NullVoxPopuli/ember-apply/pull/556) docs: Create new README section for external apply-ables ([@MichalBryxi](https://github.com/MichalBryxi))

#### :house: Internal
* `ember-apply`, `@ember-apply/embroider`, `@ember-apply/tailwind-webpack`, `@ember-apply/tailwind`, `@ember-apply/typescript`
  * [#549](https://github.com/NullVoxPopuli/ember-apply/pull/549) Prepare Release ([@github-actions[bot]](https://github.com/apps/github-actions))
* Other
  * [#584](https://github.com/NullVoxPopuli/ember-apply/pull/584) npx create-release-plan-setup@latest --update ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 3
- Michal Bryxí ([@MichalBryxi](https://github.com/MichalBryxi))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@github-actions[bot]](https://github.com/apps/github-actions)

## Release (2025-01-22)

ember-apply 2.13.0 (minor)
@ember-apply/embroider 1.1.0 (minor)
@ember-apply/tailwind 2.2.0 (minor)
@ember-apply/tailwind-webpack 1.1.0 (minor)
@ember-apply/typescript 1.3.0 (minor)

#### :rocket: Enhancement
* `ember-apply`, `docs`, `@ember-apply/embroider`, `@ember-apply/tailwind-webpack`, `@ember-apply/tailwind`, `@ember-apply/typescript`
  * [#581](https://github.com/NullVoxPopuli/ember-apply/pull/581) Add tsconfig utilities ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* [#560](https://github.com/NullVoxPopuli/ember-apply/pull/560) docs: Applyable organisation ([@MichalBryxi](https://github.com/MichalBryxi))
* [#556](https://github.com/NullVoxPopuli/ember-apply/pull/556) docs: Create new README section for external apply-ables ([@MichalBryxi](https://github.com/MichalBryxi))

#### :house: Internal
* [#584](https://github.com/NullVoxPopuli/ember-apply/pull/584) npx create-release-plan-setup@latest --update ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Michal Bryxí ([@MichalBryxi](https://github.com/MichalBryxi))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2024-02-19)

@ember-apply/unstable-embroider 1.1.0 (minor)

#### :rocket: Enhancement
* `@ember-apply/unstable-embroider`
  * [#547](https://github.com/NullVoxPopuli/ember-apply/pull/547) Add broccoli-side-watch and babel-loader-9 to the "try unstable embro… ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2024-02-15)

@ember-apply/embroider 1.0.39 (patch)

#### :bug: Bug Fix
* `@ember-apply/embroider`
  * [#542](https://github.com/NullVoxPopuli/ember-apply/pull/542) update starting versions of embroider dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2024-02-13)

@ember-apply/unstable-embroider 1.0.4 (patch)

#### :bug: Bug Fix
* `@ember-apply/unstable-embroider`
  * [#541](https://github.com/NullVoxPopuli/ember-apply/pull/541) Fix unstable embroider applyable that sets the pnpm.overrides ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2024-02-02)

ember-apply 2.12.0 (minor)
@ember-apply/tailwind 2.1.0 (minor)
@ember-apply/volta 2.0.6 (patch)

#### :rocket: Enhancement
* `ember-apply`, `@ember-apply/tailwind`
  * [#535](https://github.com/NullVoxPopuli/ember-apply/pull/535) Use one command to start ember and tailwind ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#531](https://github.com/NullVoxPopuli/ember-apply/pull/531) docs: Typo in README.md ([@MichalBryxi](https://github.com/MichalBryxi))

#### :house: Internal
* `@ember-apply/volta`
  * [#532](https://github.com/NullVoxPopuli/ember-apply/pull/532) Setup release plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Michal Bryxí ([@MichalBryxi](https://github.com/MichalBryxi))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
