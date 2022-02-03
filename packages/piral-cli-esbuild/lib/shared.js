"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequireRef = exports.getPackageName = void 0;
function getPackageName() {
    return process.env.BUILD_PCKG_NAME;
}
exports.getPackageName = getPackageName;
function getRequireRef() {
    const name = getPackageName();
    return `esbuildpr_${name.replace(/\W/gi, '')}`;
}
exports.getRequireRef = getRequireRef;
//# sourceMappingURL=shared.js.map