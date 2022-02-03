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
const bundler_run_1 = require("./bundler-run");
const pilet_1 = require("../configs/pilet");
function run(root, piral, sourceMaps, contentHash, minify, externals, importmap, outDir, outFile, entryModule, version, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.setStandardEnvs)({
            production: true,
            piral,
            root,
        });
        const config = (0, pilet_1.createConfig)(entryModule, outDir, outFile, externals, importmap, version, false, sourceMaps, contentHash, minify);
        const bundler = (0, bundler_run_1.runEsbuild)(config, logLevel, false);
        return yield bundler.bundle();
    });
}
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    switch (msg.type) {
        case 'start':
            const result = yield run(process.cwd(), msg.piral, msg.sourceMaps, msg.contentHash, msg.minify, msg.externals, msg.importmap, msg.outDir, msg.outFile, msg.entryModule, msg.version, msg.logLevel).catch((error) => {
                process.send({
                    type: 'fail',
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            });
            if (result) {
                process.send({
                    type: 'done',
                    outDir: result.outDir,
                    outFile: result.outFile,
                });
            }
            break;
    }
}));
//# sourceMappingURL=run-build-pilet.js.map