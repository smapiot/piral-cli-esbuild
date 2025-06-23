import type { PiletBuildHandler, PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { BuildOptions } from 'esbuild';
import { autoPathPlugin } from 'esbuild-auto-path-plugin';
import { externalsPlugin } from 'esbuild-externals-plugin';
import { piletPlugin } from 'esbuild-pilet-plugin';
import { basename, extname } from 'path';
import { createCommonConfig } from './common';
import { runEsbuild } from './bundler-run';
import { extendConfig } from '../helpers';

function nameOf(path: string) {
  const file = basename(path);
  const ext = extname(file);
  return file.substring(0, file.length - ext.length);
}

function getPackageName() {
  return process.env.BUILD_PCKG_NAME;
}

function getRequireRef() {
  const name = getPackageName();
  return `esbuildpr_${name.replace(/\W/gi, '')}`;
}

const supportedSchemas = ['v2', 'v3'];

function checkSupported(schema: string): asserts schema is 'v2' | 'v3' {
  if (!supportedSchemas.includes(schema)) {
    throw new Error(
      `The provided schema version is not supported. This version supports: ${supportedSchemas.join(', ')}.`,
    );
  }
}

function createConfig(
  entryModule: string,
  outdir: string,
  filename: string,
  external: Array<string>,
  requireRef: string,
  importmap: Array<SharedDependency> = [],
  schema: PiletSchemaVersion,
  development = false,
  sourcemap = true,
  contentHash = true,
  minify = true,
): BuildOptions {
  checkSupported(schema);

  const config = createCommonConfig(outdir, development, sourcemap, contentHash, minify);
  const name = nameOf(filename);
  const entryPoints = {
    [name]: entryModule,
  };

  importmap.forEach((dep) => {
    entryPoints[nameOf(dep.ref)] = dep.entry;
  });

  return {
    ...config,
    entryPoints,
    publicPath: './',
    splitting: true,
    external,
    format: 'esm',
    plugins: [
      ...config.plugins,
      autoPathPlugin(),
      externalsPlugin(importmap.map((m) => m.name)),
      piletPlugin({ schema, importmap, requireRef, name: getPackageName() }),
    ],
  };
}

const handler: PiletBuildHandler = {
  create(options) {
    const requireRef = getRequireRef();
    const baseConfig = createConfig(
      options.entryModule,
      options.outDir,
      options.outFile,
      options.externals,
      requireRef,
      options.importmap,
      options.version,
      options.develop,
      options.sourceMaps,
      options.contentHash,
      options.minify,
    );
    const config = extendConfig(baseConfig, options.root);
    return runEsbuild(config, options.logLevel, options.watch, requireRef);
  },
};

export const create = handler.create;
