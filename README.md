# GMTools

Functions and other tools for GreaseMonkey UserScript development.

## Use

### In a Node project

To use in a Node project, add GMTools as a dependency.
The package is still in early development and so is not on NPM,
meaning you'll need to use a Git link.

```sh
# npm
npm install git+https://gitlab.com/MysteryBlokHed/gmtools.git

# yarn
yarn add git+https://gitlab.com/MysteryBlokHed/gmtools.git
```

You can then import and use GMTools functions:

```javascript
import { configProxy, getConfigValues } from 'gmtools'

const config = configProxy(
  await getConfigValues({
    hello: 'World!',
  })
)
```

### In a normal UserScript

In a UserScript that isn't built with Node.js, you can `@require` the library:

```javascript
// @require     https://gitlab.com/MysteryBlokHed/gmtools/-/raw/main/gmtools.user.js
```

You can replace `main` with a specific release tag like `v0.1.0` to require a specific version:

```javascript
// @require     https://gitlab.com/MysteryBlokHed/gmtools/-/raw/v0.1.0/gmtools.user.js
```

The UserScript file on tags will be built in production mode, while the file on the main branch will be in development mode.

Functions are available on the global `GMTools` object:

```javascript
const { configProxy, getConfigValues } = GMTools

const config = configProxy(
  await getConfigValues({
    hello: 'World!',
  })
)
```

## License

GMTools is licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or
  <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or
  <http://opensource.org/licenses/MIT>)

at your option.
