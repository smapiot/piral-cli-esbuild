import type { SharedDependency } from 'piral-cli';
import { Plugin } from 'esbuild';
export interface PiletPluginOptions {
    importmap: Array<SharedDependency>;
}
export declare const piletPlugin: (options: PiletPluginOptions) => Plugin;
