import type { SharedDependency } from "piral-cli";
import type { PluginObj } from "@babel/core";
export interface PluginOptions {
    importmap: Array<SharedDependency>;
}
export default function babelPlugin({ types }: {
    types: any;
}): PluginObj;
