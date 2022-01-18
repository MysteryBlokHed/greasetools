import { checkGrants } from '.'

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
export function xhrPromise<Request extends GM.Request = GM.Request>(
  xhrInfo: Request,
): Promise<GM.Response<Request>> {
  return new Promise((resolve, reject) => {
    let lastState = XMLHttpRequest.UNSENT

    if (checkGrants('xmlHttpRequest')) {
      GM.xmlHttpRequest({
        ...xhrInfo,
        onreadystatechange: response => {
          if (response.readyState === XMLHttpRequest.DONE) {
            if (lastState < 3) reject(new Error('XHR failed'))
            else resolve(response)
          }
          lastState = response.readyState
        },
      })
    } else reject(new Error('Missing grant GM.xmlHttpRequest'))
  })
}
