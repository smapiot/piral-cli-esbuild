import type { SharedDependency } from 'piral-cli';
import type { PluginObj } from '@babel/core';
import type { Statement } from '@babel/types';
import template from '@babel/template';

export interface PluginOptions {
  name: string;
  importmap: Array<SharedDependency>;
  requireRef: string;
  cssFiles: Array<string>;
  schema: 'v2' | 'v3';
}

export default function babelPlugin(): PluginObj {
  const debug = process.env.NODE_ENV === 'development';

  return {
    visitor: {
      Program(path, state) {
        const { name, importmap, requireRef, cssFiles, schema } = state.opts as PluginOptions;
        const deps = importmap.reduce((obj, dep) => {
          obj[dep.id] = dep.ref;
          return obj;
        }, {});

        if (schema === 'v2') {
          path.addComment('leading', `@pilet v:2(${requireRef},${JSON.stringify(deps)})`, true);

          if (cssFiles.length > 0) {
            const bundleUrl = `function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}`;
            const stylesheet = [
              `var d=document`,
              `var __bundleUrl__=(${bundleUrl})()`,
              `${JSON.stringify(cssFiles)}.forEach(cf=>{`,
              `var u=__bundleUrl__+cf`,
              `var e=d.createElement("link")`,
              `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
              `e.type="text/css"`,
              `e.rel="stylesheet"`,
              `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
              `d.head.appendChild(e)`,
              `})`,
            ].join(';\n');
            path.node.body.push(template.ast(`(function(){${stylesheet}})()`) as Statement);
          }
        } else if (schema === 'v3') {
          path.addComment('leading', `@pilet v:3(${requireRef},${JSON.stringify(deps)})`, true);

          if (cssFiles.length > 0) {
            path.node.body.push(template.ast(`export const styles = ${JSON.stringify(cssFiles)};`) as Statement);
          }
        }
      },
    },
  };
}
