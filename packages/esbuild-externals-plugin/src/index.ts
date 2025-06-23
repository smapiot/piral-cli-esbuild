import { Plugin } from 'esbuild';

export interface ExternalsPluginOptionsObject {
  /**
   * The names of the modules to be externalized.
   */
  names: Array<string>;
}

export type ExternalsPluginOptions = ExternalsPluginOptionsObject | Array<string>;

export const externalsPlugin = (options: ExternalsPluginOptions = []): Plugin => ({
  name: 'externals-plugin',
  setup(build) {
    const names = (Array.isArray(options) ? options : options?.names) || [];

    build.onResolve({ filter: /^[^./].*/ }, (args) => {
      const path = args.path;

      if (names.includes(path)) {
        return {
          path,
          external: true,
        };
      }
    });
  },
});
