"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const common_1 = require("./common");
const bundler_run_1 = require("./bundler-run");
const html_1 = require("../plugins/html");
const helpers_1 = require("../helpers");
function createConfig(entryFile, outdir, externals, development, sourcemap, contentHash, minify, publicPath, hmr = false) {
    const config = (0, common_1.createCommonConfig)(outdir, development, sourcemap, contentHash, minify);
    if (hmr) {
        config.banner = {
            js: `(() => new WebSocket(location.origin.replace('http', 'ws')+"/$events").onmessage = () => location.reload())();`,
        };
    }
    return Object.assign(Object.assign({}, config), { entryPoints: [entryFile], publicPath, define: Object.assign(Object.assign({}, config.define), { 'process.env.DEBUG_PIRAL': JSON.stringify(process.env.DEBUG_PIRAL || ''), 'process.env.DEBUG_PILET': JSON.stringify(process.env.DEBUG_PILET || ''), 'process.env.SHARED_DEPENDENCIES': JSON.stringify(externals.join(',')) }), plugins: [...config.plugins, (0, html_1.htmlPlugin)()] });
}
const handler = {
    create(options) {
        const baseConfig = createConfig(options.entryFiles, options.outDir, options.externals, options.emulator, options.sourceMaps, options.contentHash, options.minify, options.publicUrl, options.hmr);
        const config = (0, helpers_1.extendConfig)(baseConfig, options.root);
        return (0, bundler_run_1.runEsbuild)(config, options.logLevel, options.watch);
    },
};
exports.create = handler.create;
//# sourceMappingURL=piral.js.map