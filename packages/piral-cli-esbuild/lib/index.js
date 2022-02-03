"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions = require("./actions");
const plugin = (cli) => {
    cli.withBundler('esbuild', actions);
};
module.exports = plugin;
//# sourceMappingURL=index.js.map