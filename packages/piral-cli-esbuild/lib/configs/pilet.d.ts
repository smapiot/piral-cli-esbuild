import { BuildOptions } from 'esbuild';
import type { PiletSchemaVersion, SharedDependency } from 'piral-cli';
export declare function createConfig(entryModule: string, outdir: string, filename: string, externals: Array<string>, importmap: Array<SharedDependency>, schema: PiletSchemaVersion, development?: boolean, sourcemap?: boolean, contentHash?: boolean, minify?: boolean): BuildOptions;
