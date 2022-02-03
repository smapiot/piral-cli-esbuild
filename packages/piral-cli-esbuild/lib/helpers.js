"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const constants_1 = require("./constants");
function extendConfig(esbuildConfig, root) {
    const otherConfigPath = (0, path_1.resolve)(root, constants_1.defaultEsbuildConfig);
    if ((0, fs_1.existsSync)(otherConfigPath)) {
        const otherConfig = require(otherConfigPath);
        if (typeof otherConfig === 'function') {
            esbuildConfig = otherConfig(esbuildConfig);
        }
        else if (typeof otherConfig === 'object') {
            return Object.assign(Object.assign({}, esbuildConfig), otherConfig);
        }
        else {
            console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
        }
    }
    return esbuildConfig;
}
exports.extendConfig = extendConfig;
//# sourceMappingURL=helpers.js.map