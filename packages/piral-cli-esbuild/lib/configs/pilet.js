"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
const path_1 = require("path");
const pilet_1 = require("../plugins/pilet");
const common_1 = require("./common");
function nameOf(path) {
    const file = (0, path_1.basename)(path);
    const ext = (0, path_1.extname)(file);
    return file.substr(0, file.length - ext.length);
}
function createConfig(entryModule, outdir, filename, externals, importmap = [], schema, development = false, sourcemap = true, contentHash = true, minify = true) {
    if (schema !== 'v2') {
        throw new Error('The provided schema version is not supported. Only "v2" works with esbuild.');
    }
    const config = (0, common_1.createCommonConfig)(outdir, development, sourcemap, contentHash, minify);
    const name = nameOf(filename);
    const external = [...externals, ...importmap.map((m) => m.name)];
    const entryPoints = {
        [name]: entryModule,
    };
    importmap.forEach((dep) => {
        entryPoints[nameOf(dep.ref)] = dep.entry;
    });
    return Object.assign(Object.assign({}, config), { entryPoints, publicPath: './', splitting: true, external, format: 'esm', plugins: [...config.plugins, (0, pilet_1.piletPlugin)({ importmap })] });
}
exports.createConfig = createConfig;
//# sourceMappingURL=pilet.js.map