import { BuildOptions } from 'esbuild';
export declare function createConfig(entryFile: string, outdir: string, externals: Array<string>, development: boolean, sourcemap: boolean, contentHash: boolean, minify: boolean, publicPath: string, hmr?: boolean): BuildOptions;
