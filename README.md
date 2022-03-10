# GreaseTools [![Build Badge]](https://gitlab.com/MysteryBlokHed/greasetools/-/pipelines) [![NPM Badge]](https://www.npmjs.com/package/greasetools) [![License Badge]](#license)

Functions and other tools for GreaseMonkey UserScript development.

## Documentation

Documentation for the main branch is hosted at <https://greasetools.adamts.me>.
Documentation can be built from a cloned repository by running `yarn doc`.

## Use

Most functions will require some `@grant`'s to work properly,
but can fall back to other things like the browser's localStorage if grants aren't found.
Information for each function can be found in its docs.

### In a Node project

To use in a Node project, add GreaseTools as a dependency.

```sh
# npm
npm install greasetools

# yarn
yarn add greasetools
```

You can then import and use GreaseTools functions:

```javascript
import { valuesProxy, getValues } from 'greasetools'

const values = valuesProxy(
  await getValues({
    hello: 'World!',
  }),
)
```

### In a normal UserScript

In a UserScript that isn't built with Node.js, you can `@require` the library:

```javascript
// @require     https://gitlab.com/MysteryBlokHed/greasetools/-/raw/main/greasetools.user.js
```

You can replace `main` with a specific release tag like `v0.1.0` to require a specific version:

```javascript
// @require     https://gitlab.com/MysteryBlokHed/greasetools/-/raw/v0.1.0/greasetools.user.js
```

Each release tag also has a minified version of the script available,
which can be used by changing the file extension to `.min.user.js`:

```javascript
// @require     https://gitlab.com/MysteryBlokHed/greasetools/-/raw/v0.1.0/greasetools.min.user.js
```

Functions are available on the global `GreaseTools` object:

```javascript
const { valuesProxy, getValues } = GreaseTools

const values = valuesProxy(
  await getValues({
    hello: 'World!',
  }),
)
```

#### Type declarations

The types included with the npm package still work when the library is `@require`'d.
Just add the types as a dev dependency for a Node project or install it globally.
With the package installed, include the following reference line somewhere in your TypeScript source file:

```typescript
/// <reference types="greasetools" />
```

## License

GreaseTools is licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or
  <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or
  <http://opensource.org/licenses/MIT>)

at your option.

[build badge]: https://img.shields.io/gitlab/pipeline-status/MysteryBlokHed/greasetools
[npm badge]: https://img.shields.io/npm/v/greasetools
[license badge]: https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-green
