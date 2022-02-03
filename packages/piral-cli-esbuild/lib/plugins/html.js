"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlPlugin = void 0;
const cheerio_1 = require("cheerio");
const fs_1 = require("fs");
const path_1 = require("path");
function isLocal(path) {
    if (path) {
        if (path.startsWith(":")) {
            return false;
        }
        else if (path.startsWith("http:")) {
            return false;
        }
        else if (path.startsWith("https:")) {
            return false;
        }
        else if (path.startsWith("data:")) {
            return false;
        }
        return true;
    }
    return false;
}
function getName(path) {
    const name = filename(path);
    if (/\.(jsx?|tsx?)$/.test(path) && name === "index") {
        return "main";
    }
    else {
        return name;
    }
}
function filename(path) {
    const file = (0, path_1.basename)(path);
    const ext = (0, path_1.extname)(file);
    return file.substring(0, file.length - ext.length);
}
function extractParts(content, publicPath) {
    const sheets = content("link[href][rel=stylesheet]")
        .filter((_, e) => isLocal(e.attribs.href))
        .remove()
        .toArray();
    const scripts = content("script[src]")
        .filter((_, e) => isLocal(e.attribs.src))
        .remove()
        .toArray();
    const files = [];
    const prefix = publicPath.endsWith("/") ? publicPath : `${publicPath}/`;
    for (const script of scripts) {
        const src = script.attribs.src;
        const name = getName(src);
        files.push(src);
        content("body").append(`<script src="${prefix}${name}.js"></script>`);
    }
    for (const sheet of sheets) {
        const href = sheet.attribs.href;
        const name = filename(href);
        files.push(href);
        content("head").append(`<link href="${prefix}${name}.css" rel="stylesheet" />`);
    }
    return files;
}
function modifyHtmlFile(rootDir, htmlFile, publicPath, outDir) {
    const template = (0, path_1.resolve)(rootDir, htmlFile);
    const src = (0, path_1.dirname)(template);
    const dest = (0, path_1.resolve)(outDir, "index.html");
    const templateContent = (0, cheerio_1.load)((0, fs_1.readFileSync)(template, "utf8"));
    const newEntries = extractParts(templateContent, publicPath).map((entry) => (0, path_1.resolve)(src, entry));
    templateContent("*")
        .contents()
        .filter((_, m) => m.type === "text")
        .each((_, m) => {
        m.nodeValue = m.nodeValue.replace(/\s+/g, " ");
    });
    (0, fs_1.writeFileSync)(dest, templateContent.html({}), "utf8");
    return newEntries;
}
const htmlPlugin = () => ({
    name: "html-loader",
    setup(build) {
        const rootDir = process.cwd();
        const publicPath = build.initialOptions.publicPath || "/";
        const outDir = build.initialOptions.outdir
            ? (0, path_1.resolve)(rootDir, build.initialOptions.outdir)
            : (0, path_1.dirname)((0, path_1.resolve)(rootDir, build.initialOptions.outfile));
        const entries = build.initialOptions.entryPoints;
        (0, fs_1.mkdirSync)(outDir, {
            recursive: true,
        });
        if (Array.isArray(entries)) {
            entries
                .filter((m) => m.endsWith(".html"))
                .forEach((htmlFile) => {
                const index = entries.indexOf(htmlFile);
                const newEntries = modifyHtmlFile(rootDir, htmlFile, publicPath, outDir);
                entries.splice(index, 1, ...newEntries);
            });
            build.initialOptions.entryPoints = entries.reduce((entries, entry) => {
                const name = getName(entry);
                entries[name] = entry;
                return entries;
            }, {});
        }
        else {
            Object.keys(entries)
                .filter((m) => entries[m].endsWith(".html"))
                .forEach((m) => {
                const htmlFile = entries[m];
                const newEntries = modifyHtmlFile(rootDir, htmlFile, publicPath, outDir);
                delete entries[m];
                for (const entry of newEntries) {
                    const name = getName(entry);
                    entries[name] = entry;
                }
            });
        }
    },
});
exports.htmlPlugin = htmlPlugin;
//# sourceMappingURL=html.js.map