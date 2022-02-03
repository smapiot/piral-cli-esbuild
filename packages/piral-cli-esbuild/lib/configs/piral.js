"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
const html_1 = require("../plugins/html");
const common_1 = require("./common");
function createConfig(entryFile, outdir, externals, development, sourcemap, contentHash, minify, publicPath, hmr = false) {
    const config = (0, common_1.createCommonConfig)(outdir, development, sourcemap, contentHash, minify);
    if (hmr) {
        config.banner = {
            js: `(() => new WebSocket(location.origin.replace('http', 'ws')+"/$events").onmessage = () => location.reload())();`,
        };
    }
    return Object.assign(Object.assign({}, config), { entryPoints: [entryFile], publicPath, define: Object.assign(Object.assign({}, config.define), { 'process.env.DEBUG_PIRAL': JSON.stringify(process.env.DEBUG_PIRAL || ''), 'process.env.DEBUG_PILET': JSON.stringify(process.env.DEBUG_PILET || ''), 'process.env.SHARED_DEPENDENCIES': JSON.stringify(externals.join(',')) }), plugins: [...config.plugins, (0, html_1.htmlPlugin)()] });
}
exports.createConfig = createConfig;
//# sourceMappingURL=piral.js.map