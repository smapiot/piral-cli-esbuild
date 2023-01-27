# `esbuild-auto-path-plugin`

A plugin for `esbuild` to allow referencing files relative to the path of the JavaSCript. This can be useful to work in a micro frontend setup where the individual files of one micro frontend are served from a different path than the other micro frontends, i.e., no common public path can be determined.

## Usage

Install the plugin:

```sh
npm i esbuild-auto-path-plugin --save-dev
```

Now in your `esbuild` configuration file you can do:

```js
const { build } = require('esbuild');
const { autoPathPlugin } = require('esbuild-auto-path-plugin');

build({
  // ...
  plugins: [autoPathPlugin()],
});
```

At this point you can reference an asset file (e.g., `.jpg`) in any file, e.g., in a TypeScript asset

```js
import someImage from './my.jpg';
```

The reference to the generated asset file will be done via the automatically (i.e., at runtime) determined path.

### File Extensions

This plugin takes all extensions mapped to the `file` type in your esbuild configuration. However, you can also use the plugin to generate you this list of files. By default (i.e., if you don't specify any option and have not introduced any custom loader mapping) the following extensions will be mapped:

- `.png`
- `.svg`
- `.jpg`
- `.jpeg`
- `.webp`
- `.mp4`
- `.mp3`
- `.ogg`
- `.wav`
- `.ogv`
- `.wasm`
- `.gif`

To override this list you can just pass in the extensions like this:

```js
const { build } = require('esbuild');
const { autoPathPlugin } = require('esbuild-auto-path-plugin');

build({
  plugins: [autoPathPlugin({
    defaultExtensions: [".png", ".mov", ".woff"]
  })],
});
```

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](LICENSE).
