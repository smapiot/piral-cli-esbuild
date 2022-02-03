import type { SharedDependency } from 'piral-cli';
import type { PluginObj } from '@babel/core';
export interface PluginOptions {
    name: string;
    importmap: Array<SharedDependency>;
    requireRef: string;
    cssFiles: Array<string>;
}
export default function babelPlugin(): PluginObj;
