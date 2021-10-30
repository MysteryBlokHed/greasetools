"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get a UserScript banner from an object.
 * Undefined values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param props Properties to turn into a banner
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
function genBanner(props) {
    let final = '// ==UserScript==\n';
    const format = (prop, value) => `// @${prop}${' '.repeat(12 - prop.length)}${value}\n`;
    for (const [key, value] of Object.entries(props)) {
        if (!value)
            continue;
        if (typeof value === 'string') {
            final += format(key, value);
        }
        else {
            for (const val of value) {
                if (!val)
                    continue;
                final += format(key, val);
            }
        }
    }
    final += '// ==/UserScript==\n';
    return final;
}
exports.default = genBanner;
