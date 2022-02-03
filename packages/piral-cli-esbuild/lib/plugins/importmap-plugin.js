"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function babelPlugin({ types }) {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                const { importmap } = state.opts;
                path.traverse({
                    Literal(path) {
                        if (path.node.type === "StringLiteral") {
                            const name = path.node.value;
                            const entry = importmap.find((m) => m.name === name);
                            if (entry) {
                                path.replaceWith(types.stringLiteral(entry.requireId || entry.id));
                            }
                        }
                    },
                });
            },
        },
    };
}
exports.default = babelPlugin;
//# sourceMappingURL=importmap-plugin.js.map