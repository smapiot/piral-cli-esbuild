"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEsbuild = void 0;
const esbuild_1 = require("esbuild");
const path_1 = require("path");
const events_1 = require("events");
const shared_1 = require("../shared");
function runEsbuild(config, logLevel, watch) {
    const eventEmitter = new events_1.EventEmitter();
    const rootDir = process.cwd();
    const outDir = config.outdir ? (0, path_1.resolve)(rootDir, config.outdir) : (0, path_1.dirname)((0, path_1.resolve)(rootDir, config.outfile));
    const name = `${Object.keys(config.entryPoints)[0]}.js`;
    const bundle = {
        outFile: `/${name}`,
        outDir,
        name,
        requireRef: (0, shared_1.getRequireRef)(),
    };
    switch (logLevel) {
        case 0:
            config.logLevel = 'silent';
            break;
        case 1:
            config.logLevel = 'error';
            break;
        case 2:
            config.logLevel = 'warning';
            break;
        case 4:
            config.logLevel = 'verbose';
            break;
        case 5:
            config.logLevel = 'debug';
            break;
        case 3:
        default:
            config.logLevel = 'info';
            break;
    }
    config.plugins.push({
        name: 'piral-cli',
        setup(build) {
            build.onStart(() => {
                eventEmitter.emit('start');
            });
            build.onEnd(() => {
                eventEmitter.emit('end', bundle);
            });
        },
    });
    config.watch = watch;
    return Promise.resolve({
        bundle() {
            return (0, esbuild_1.build)(config).then((result) => {
                if (result.errors.length > 0) {
                    throw new Error(JSON.stringify(result.errors));
                }
                else {
                    return bundle;
                }
            });
        },
        onStart(cb) {
            eventEmitter.on('start', cb);
        },
        onEnd(cb) {
            eventEmitter.on('end', cb);
        },
    });
}
exports.runEsbuild = runEsbuild;
//# sourceMappingURL=bundler-run.js.map