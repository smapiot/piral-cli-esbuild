# `esbuild-node-prefix-plugin`

A plugin for `esbuild` to change imports to inbuilt Node.js modules such as `"path"` to be prefixed with `node:`, e.g., `"node:path"`. This can be handy when building for modern platforms.

## Usage

Install the plugin:

```sh
npm i esbuild-node-prefix-plugin --save-dev
```

Now in your `esbuild` configuration file you can do:

```js
const { build } = require('esbuild');
const { nodePrefixPlugin } = require('esbuild-node-prefix-plugin');

build({
  // ...
  plugins: [nodePrefixPlugin()],
});
```

Full configuration example:

```js
const { build } = require("esbuild");
const { nodePrefixPlugin } = require('esbuild-node-prefix-plugin');

build({
  outdir: "dist",
  bundle: true,
  platform: "node",
  format: "esm",
  entryPoints: ["src/index.ts"],
  logLevel: "info",
  plugins: [nodePrefixPlugin()],
});
```

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](LICENSE).
