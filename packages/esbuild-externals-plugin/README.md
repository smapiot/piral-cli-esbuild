# `esbuild-externals-plugin`

A plugin for `esbuild` to have a bit more control and convenience over externals. Most notably, introducing an external such as `rxjs` will not imply externals such as `rxjs/operators`. Instead, the latter would still be bundled. This way, there are no surprises.

## Usage

Install the plugin:

```sh
npm i esbuild-externals-plugin --save-dev
```

Now in your `esbuild` configuration file you can do:

```js
const { build } = require('esbuild');
const { externalsPlugin } = require('esbuild-externals-plugin');

build({
  // ...
  plugins: [externalsPlugin(['@angular/common', '@angular/core'])],
});
```

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](LICENSE).
