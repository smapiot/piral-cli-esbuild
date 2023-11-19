import { type BundleHandlerResponse, type LogLevels } from 'piral-cli';
import { BuildOptions, context } from 'esbuild';
import { resolve, dirname } from 'path';
import { EventEmitter } from 'events';

export function runEsbuild(config: BuildOptions, logLevel: LogLevels, watch: boolean, requireRef?: string): Promise<BundleHandlerResponse> {
  const eventEmitter = new EventEmitter();
  const rootDir = process.cwd();
  const outDir = config.outdir ? resolve(rootDir, config.outdir) : dirname(resolve(rootDir, config.outfile));
  const primary = Array.isArray(config.entryPoints) ? 'main' : Object.keys(config.entryPoints)[0];
  const name = `${primary}.js`;
  const bundle = {
    outFile: `/${name}`,
    outDir,
    name,
    requireRef,
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

  return Promise.resolve({
    async bundle() {
      const ctx = await context(config);

      if (watch) {
        await ctx.watch();
      } else {
        await ctx.rebuild();
      }

      return bundle;
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  });
}
