import { Plugin } from 'esbuild';
import { builtinModules } from 'module';

export interface NodePrefixPluginOptions {}

export const nodePrefixPlugin = (options: NodePrefixPluginOptions = {}): Plugin => ({
  name: 'node-prefix-plugin',
  setup(build) {
    build.onResolve({ filter: /^[^./].*/ }, ({ path }) => {
      // If does not already have a node: prefix and if it's a built-in module (e.g., 'fs', 'path', etc.)
      if (!path.startsWith('node:') && builtinModules.includes(path)) {
        return {
          path: `node:${path}`,
          external: true,
        };
      }
    });
  },
});
