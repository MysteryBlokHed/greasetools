"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGrants = void 0;
__exportStar(require("./banner"), exports);
__exportStar(require("./xhr"), exports);
__exportStar(require("./values"), exports);
/** Used by functions to check if grants are present */
function checkGrants(...grants) {
    if (!GM)
        return false;
    if (grants.some(grant => !(grant in GM)))
        return false;
    return true;
}
exports.checkGrants = checkGrants;
