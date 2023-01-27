import { Plugin } from "esbuild";
import { readFile } from "fs/promises";
import { isAbsolute, join, resolve } from "path";

const fallbackExtensions = [
  ".png",
  ".svg",
  ".jpg",
  ".jpeg",
  ".webp",
  ".mp4",
  ".mp3",
  ".ogg",
  ".wav",
  ".ogv",
  ".wasm",
  ".gif",
];

interface AutoPathPluginOptions {
  defaultExtensions?: Array<string>;
}

function makeExtensions(extensions = fallbackExtensions) {
  return extensions.reduce((obj, ext) => {
    obj[ext] = "file";
    return obj;
  }, {} as Record<string, "file">);
}

export const autoPathPlugin = (options: AutoPathPluginOptions = {}): Plugin => ({
  name: "auto-path-plugin",
  setup(build) {
    const { loader = makeExtensions(options.defaultExtensions) } =
      build.initialOptions;
    const extensions: Array<string> = [];

    for (const ext of Object.keys(loader)) {
      const l = loader[ext];

      if (l === "file") {
        extensions.push(ext);
        delete loader[ext];
      }
    }

    const filter = new RegExp(
      `(${extensions.map((ext) => `\\${ext}`).join("|")})$`
    );

    build.onResolve({ filter }, (args) => {
      if (args.namespace === "ref-stub") {
        return {
          path: args.path,
          namespace: "ref-binary",
        };
      } else if (args.resolveDir !== "") {
        return {
          path: isAbsolute(args.path)
            ? args.path
            : join(args.resolveDir, args.path),
          // for CSS we'll just use the path; no intermediate module needed
          namespace: args.kind === "url-token" ? "ref-binary" : "ref-stub",
        };
      } else {
        return; // Ignore unresolvable paths
      }
    });

    build.onLoad({ filter: /.*/, namespace: "ref-stub" }, async (args) => ({
      resolveDir: resolve(__dirname),
      contents: [
        `import path from ${JSON.stringify(args.path)}`,
        `import { __bundleUrl__ } from ${JSON.stringify("../set-path.js")}`,
        `export default __bundleUrl__ + path;`,
      ].join("\n"),
    }));

    build.onLoad({ filter: /.*/, namespace: "ref-binary" }, async (args) => ({
      contents: await readFile(args.path),
      loader: "file",
    }));
  },
});
