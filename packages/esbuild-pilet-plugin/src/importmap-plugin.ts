import { stringLiteral } from '@babel/types';
import type { PluginObj } from '@babel/core';
import type { SharedDependency } from 'piral-cli';

export default function babelPlugin(importmap: Array<SharedDependency>): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        path.traverse({
          Literal(path) {
            if (path.node.type === 'StringLiteral') {
              const name = path.node.value;
              const entry = importmap.find((m) => m.name === name);

              if (entry) {
                path.replaceWith(stringLiteral(entry.requireId || entry.id));
              }
            }
          },
        });
      },
    },
  };
}
