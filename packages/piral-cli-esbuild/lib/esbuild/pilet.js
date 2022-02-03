"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const path_1 = require("path");
const common_1 = require("./common");
const bundler_run_1 = require("./bundler-run");
const pilet_1 = require("../plugins/pilet");
const helpers_1 = require("../helpers");
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
const handler = {
    create(options) {
        const baseConfig = createConfig(options.entryModule, options.outDir, options.outFile, options.externals, options.importmap, options.version, options.develop, options.sourceMaps, options.contentHash, options.minify);
        const config = (0, helpers_1.extendConfig)(baseConfig, options.root);
        return (0, bundler_run_1.runEsbuild)(config, options.logLevel, options.watch);
    },
};
exports.create = handler.create;
//# sourceMappingURL=pilet.js.map