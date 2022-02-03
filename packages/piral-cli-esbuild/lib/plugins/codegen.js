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
exports.codegenPlugin = void 0;
const path_1 = require("path");
function reloadGenerator(name) {
    delete require.cache[require.resolve(name)];
    return require(name);
}
const codegenPlugin = () => ({
    name: 'codegen-loader',
    setup(build) {
        const rootDir = process.cwd();
        const outDir = build.initialOptions.outdir
            ? (0, path_1.resolve)(rootDir, build.initialOptions.outdir)
            : (0, path_1.dirname)((0, path_1.resolve)(rootDir, build.initialOptions.outfile));
        build.onLoad({ filter: /\.codegen$/ }, (args) => __awaiter(this, void 0, void 0, function* () {
            const name = args.path;
            const generator = reloadGenerator(name);
            const watchFiles = [];
            const contents = yield generator.call({
                name,
                options: {
                    outDir,
                    rootDir,
                },
                addDependency: (file, options) => {
                    watchFiles.push(file);
                },
            });
            return {
                watchFiles,
                contents,
            };
        }));
    },
});
exports.codegenPlugin = codegenPlugin;
//# sourceMappingURL=codegen.js.map