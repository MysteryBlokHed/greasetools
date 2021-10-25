# GMTools

Functions and other tools for GreaseMonkey UserScript development.

## Use

### In a Node project

To use in a Node project, add GMTools as a dependency.
The package is still in early development and so is not on NPM,
meaning you'll need to use a Git link.

NPM:

```sh
npm install git+https://gitlab.com/MysteryBlokHed/gmtools.git
```

Yarn:

```sh
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

In a UserScript that doesn't use a tool like Webpack, you can `@require` the library:

```js
// (insert example here at some point)
```

Functions are available on the `GMTools` object:

```js
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
