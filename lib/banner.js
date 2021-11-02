"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get a UserScript banner from an object.
 * Undefined values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param props Properties to turn into a banner
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
function genBanner(props, spacing = 12) {
    let final = '// ==UserScript==\n';
    const format = (prop, value) => `// @${prop}${' '.repeat(spacing - prop.length)}${value}\n`;
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