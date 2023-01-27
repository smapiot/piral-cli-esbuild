import type { SharedDependency } from 'piral-cli';
import { Plugin } from 'esbuild';
import { transformFileAsync } from '@babel/core';
import { promises } from 'fs';
import { resolve, basename } from 'path';

export interface PiletPluginOptions {
  name: string;
  requireRef: string;
  importmap: Array<SharedDependency>;
}

export const piletPlugin = (options: PiletPluginOptions): Plugin => ({
  name: 'pilet-plugin',
  setup(build) {
    build.initialOptions.metafile = true;

    build.onEnd(async (result) => {
      const root = process.cwd();

      if (result.metafile) {
        const { outputs } = result.metafile;
        const { entryPoints } = build.initialOptions;
        const [name] = Object.keys(entryPoints);
        const entryModule = resolve(root, entryPoints[name]);
        const cssFiles = Object.keys(outputs)
          .filter((m) => m.endsWith('.css'))
          .map((m) => basename(m));

        await Promise.all(
          Object.keys(outputs)
            .filter((m) => m.endsWith('.js'))
            .map(async (file) => {
              const { entryPoint } = outputs[file];
              const isEntryModule = entryPoint && resolve(root, entryPoint) === entryModule;
              const path = resolve(root, file);
              const smname = `${file}.map`;
              const smpath = resolve(root, smname);
              const sourceMaps = smname in outputs;
              const inputSourceMap = sourceMaps ? JSON.parse(await promises.readFile(smpath, 'utf8')) : undefined;
              const plugins: Array<any> = [
                [
                  require.resolve('./importmap-plugin'),
                  {
                    importmap: options.importmap,
                  },
                ],
              ];

              if (isEntryModule) {
                plugins.push([
                  require.resolve('./banner-plugin'),
                  {
                    name: options.name,
                    importmap: options.importmap,
                    requireRef: options.requireRef,
                    cssFiles,
                  },
                ]);
              }

              const { code, map } = await transformFileAsync(path, {
                sourceMaps,
                inputSourceMap,
                comments: isEntryModule,
                plugins,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      modules: 'systemjs',
                    },
                  ],
                ],
              });

              if (map) {
                await promises.writeFile(smpath, JSON.stringify(map), 'utf8');
              }

              await promises.writeFile(path, code, 'utf8');
            }),
        );
      }
    });
  },
});
