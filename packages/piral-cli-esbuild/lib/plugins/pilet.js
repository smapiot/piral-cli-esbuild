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
exports.piletPlugin = void 0;
const core_1 = require("@babel/core");
const fs_1 = require("fs");
const path_1 = require("path");
const shared_1 = require("../shared");
const piletPlugin = (options) => ({
    name: 'pilet-plugin',
    setup(build) {
        const loaders = build.initialOptions.loader || {};
        const extensions = [];
        for (const ext of Object.keys(loaders)) {
            const loader = loaders[ext];
            if (loader === 'file') {
                extensions.push(ext);
                delete loaders[ext];
            }
        }
        build.initialOptions.metafile = true;
        const filter = new RegExp(`(${extensions.map((ext) => `\\${ext}`).join('|')})$`);
        build.onResolve({ filter }, (args) => {
            if (args.namespace === 'ref-stub') {
                return {
                    path: args.path,
                    namespace: 'ref-binary',
                };
            }
            else if (args.resolveDir !== '') {
                return {
                    path: (0, path_1.isAbsolute)(args.path) ? args.path : (0, path_1.join)(args.resolveDir, args.path),
                    namespace: 'ref-stub',
                };
            }
            else {
                return; // Ignore unresolvable paths
            }
        });
        build.onLoad({ filter: /.*/, namespace: 'ref-stub' }, (args) => __awaiter(this, void 0, void 0, function* () {
            return ({
                resolveDir: (0, path_1.resolve)(__dirname),
                contents: [
                    `import path from ${JSON.stringify(args.path)}`,
                    `import { __bundleUrl__ } from ${JSON.stringify('../../set-path.js')}`,
                    `export default __bundleUrl__ + path;`,
                ].join('\n'),
            });
        }));
        build.onLoad({ filter: /.*/, namespace: 'ref-binary' }, (args) => __awaiter(this, void 0, void 0, function* () {
            return ({
                contents: yield fs_1.promises.readFile(args.path),
                loader: 'file',
            });
        }));
        build.onEnd((result) => __awaiter(this, void 0, void 0, function* () {
            const root = process.cwd();
            if (result.metafile) {
                const { outputs } = result.metafile;
                const { entryPoints } = build.initialOptions;
                const [name] = Object.keys(entryPoints);
                const entryModule = (0, path_1.resolve)(root, entryPoints[name]);
                const cssFiles = Object.keys(outputs)
                    .filter((m) => m.endsWith('.css'))
                    .map((m) => (0, path_1.basename)(m));
                yield Promise.all(Object.keys(outputs)
                    .filter((m) => m.endsWith('.js'))
                    .map((file) => __awaiter(this, void 0, void 0, function* () {
                    const { entryPoint } = outputs[file];
                    const isEntryModule = entryPoint && (0, path_1.resolve)(root, entryPoint) === entryModule;
                    const path = (0, path_1.resolve)(root, file);
                    const smname = `${file}.map`;
                    const smpath = (0, path_1.resolve)(root, smname);
                    const sourceMaps = smname in outputs;
                    const inputSourceMap = sourceMaps ? JSON.parse(yield fs_1.promises.readFile(smpath, 'utf8')) : undefined;
                    const plugins = [
                        [
                            require.resolve('./importmap-plugin'),
                            {
                                importmap: options.importmap,
                            },
                        ],
                    ];
                    if (isEntryModule) {
                        plugins.push([
                            require.resolve('./banner-plugin'),
                            {
                                name: (0, shared_1.getPackageName)(),
                                importmap: options.importmap,
                                requireRef: (0, shared_1.getRequireRef)(),
                                cssFiles,
                            },
                        ]);
                    }
                    const { code, map } = yield (0, core_1.transformFileAsync)(path, {
                        sourceMaps,
                        inputSourceMap,
                        comments: isEntryModule,
                        plugins,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: 'systemjs',
                                },
                            ],
                        ],
                    });
                    if (map) {
                        yield fs_1.promises.writeFile(smpath, JSON.stringify(map), 'utf8');
                    }
                    yield fs_1.promises.writeFile(path, code, 'utf8');
                })));
            }
        }));
    },
});
exports.piletPlugin = piletPlugin;
//# sourceMappingURL=pilet.js.map