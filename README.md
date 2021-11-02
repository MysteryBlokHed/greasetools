# GreaseTools

Functions and other tools for GreaseMonkey UserScript development.

## Use

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
  })
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

The UserScript file on tags will be built in production mode, while the file on the main branch will be in development mode.

Functions are available on the global `GreaseTools` object:

```javascript
const { valuesProxy, getValues } = GreaseTools

const values = valuesProxy(
  await getValues({
    hello: 'World!',
  })
)
```

## License

GreaseTools is licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or
  <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or
  <http://opensource.org/licenses/MIT>)

at your option.
