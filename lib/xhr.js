"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xhrPromise = void 0;
const _1 = require(".");
/**
 * Make a request with GM.xmlHttpRequest using Promises.
 * Requires the GM.xmlHttpRequest grant
 *
 * @param xhrInfo The XHR info
 * @returns A Promise that resolves with the Greasemonkey Response object
 * @see {@link https://wiki.greasespot.net/GM.xmlHttpRequest}
 *
 * @example
 * ```typescript
 * // Make a GET request to https://example.com
 * const example = await xhrPromise({
 *   method: 'GET',
 *   url: 'https://example.com',
 * })
 * ```
 */
function xhrPromise(xhrInfo) {
    return new Promise((resolve, reject) => {
        let lastState = XMLHttpRequest.UNSENT;
        if ((0, _1.checkGrants)('xmlHttpRequest')) {
            GM.xmlHttpRequest(Object.assign(Object.assign({}, xhrInfo), { onreadystatechange: response => {
                    if (response.readyState === XMLHttpRequest.DONE) {
                        if (lastState < 3)
                            reject(new Error('XHR failed'));
                        else
                            resolve(response);
                    }
                    lastState = response.readyState;
                } }));
        }
        else
            reject(new Error('Missing grant GM.xmlHttpRequest'));
    });
}
exports.xhrPromise = xhrPromise;
