import type { BundleHandlerResponse, LogLevels } from 'piral-cli';
import { BuildOptions } from 'esbuild';
export declare function runEsbuild(config: BuildOptions, logLevel: LogLevels, watch: boolean): Promise<BundleHandlerResponse>;
