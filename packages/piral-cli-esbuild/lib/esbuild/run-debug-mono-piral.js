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
const piral_1 = require("../configs/piral");
function run(root, piral, hmr, externals, entryFiles, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.progress)(`Preparing supplied Piral instance ...`);
        const outDir = (0, path_1.resolve)(root, 'dist', 'app');
        (0, utils_1.setStandardEnvs)({
            piral,
            dependencies: externals,
            production: false,
            debugPiral: true,
            debugPilet: true,
            root,
        });
        const config = (0, piral_1.createConfig)(entryFiles, outDir, externals, true, true, false, false, undefined, hmr);
        const bundler = (0, bundler_run_1.runEsbuild)(config, logLevel, true);
        const bundle = yield bundler.bundle();
        (0, utils_1.logReset)();
        return bundle;
    });
}
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    switch (msg.type) {
        case 'start':
            const result = yield run(process.cwd(), msg.piral, true, msg.externals, msg.entryFiles, msg.logLevel).catch((error) => {
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
//# sourceMappingURL=run-debug-mono-piral.js.map