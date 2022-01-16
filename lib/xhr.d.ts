/// <reference types="greasemonkey" />
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
export declare function xhrPromise<Request extends GM.Request = GM.Request>(xhrInfo: Request): Promise<GM.Response<Request>>;
