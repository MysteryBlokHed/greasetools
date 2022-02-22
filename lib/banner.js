"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genBanner = void 0;
/**
 * Generate a UserScript metadata comment from an object.
 * Falsey values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param metaValues Properties to add to metadata
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @param start What to put at the start of the banner. Defaults to `'// ==UserScript=='`
 * @param end What to put at the end of the banner. Defaults to `'// ==/UserScript=='`
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
function genBanner(metaValues, spacing = 12, start = '// ==UserScript==', end = '// ==/UserScript==') {
    let final = `${start}\n`;
    const format = (prop, value) => `// @${prop}${' '.repeat(spacing - prop.length)}${value}\n`;
    for (const [key, value] of Object.entries(metaValues)) {
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
    final += `${end}\n`;
    return final;
}
exports.genBanner = genBanner;
