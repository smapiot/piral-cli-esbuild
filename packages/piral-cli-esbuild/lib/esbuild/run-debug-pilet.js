"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("piral-cli/utils");
const path_1 = require("path");
const bundler_run_1 = require("./bundler-run");
const pilet_1 = require("../configs/pilet");
function run(root, piral, externals, importmap, entryModule, version, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.setStandardEnvs)({
            piral,
            root,
        });
        const dist = (0, path_1.resolve)(root, 'dist');
        const config = (0, pilet_1.createConfig)(entryModule, dist, 'index.js', externals, importmap, version, true, true, true, false);
        return (0, bundler_run_1.runEsbuild)(config, logLevel, true);
    });
}
let bundler;
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const root = process.cwd();
    switch (msg.type) {
        case 'bundle':
            if (bundler) {
                yield bundler.bundle();
                bundler.on('buildStart', () => {
                    process.send({
                        type: 'pending',
                    });
                });
            }
            break;
        case 'start':
            bundler = yield run(root, msg.piral, msg.externals, msg.importmap, msg.entryModule, msg.version, msg.logLevel).catch((error) => {
                process.send({
                    type: 'fail',
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            });
            if (bundler) {
                bundler.on('bundled', () => __awaiter(void 0, void 0, void 0, function* () {
                    if (msg.hmr) {
                        process.send({
                            type: 'update',
                            outHash: bundler.mainBundle.entryAsset.hash,
                            outName: bundler.mainBundle.name,
                            args: {
                                requireRef: bundler.mainBundle.requireRef,
                                version: msg.version,
                                root,
                            },
                        });
                    }
                }));
                process.send({
                    type: 'done',
                    outDir: bundler.options.outDir,
                });
            }
            break;
    }
}));
//# sourceMappingURL=run-debug-pilet.js.map