// ==UserScript==
// @name        greasetools
// @description Functions and other tools for GreaseMonkey UserScript development.
// @version     0.1.0
// @author      Adam Thompson-Sharpe
// @license     MIT OR Apache-2.0
// @homepageURL https://gitlab.com/MysteryBlokHed/greasetools#greasetools
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/banner.js":
/*!***********************!*\
  !*** ./lib/banner.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Generate a UserScript metadata comment from an object.
 * Falsey values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param metaValues Properties to add to metadata
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
function genBanner(metaValues, spacing = 12) {
    let final = '// ==UserScript==\n';
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
    final += '// ==/UserScript==\n';
    return final;
}
exports["default"] = genBanner;


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.genBanner = void 0;
var banner_1 = __webpack_require__(/*! ./banner */ "./lib/banner.js");
Object.defineProperty(exports, "genBanner", ({ enumerable: true, get: function () { return banner_1.default; } }));
__exportStar(__webpack_require__(/*! ./values */ "./lib/values.js"), exports);


/***/ }),

/***/ "./lib/values.js":
/*!***********************!*\
  !*** ./lib/values.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteValue = exports.valuesGetProxy = exports.valuesProxy = exports.getValues = void 0;
/**
 * Retrieves values from GreaseMonkey based on the generic type provided
 *
 * @param defaults The default values if they are undefined.
 * Each option will be set to a key from this if it does not exist
 * @returns A Promise that resolves to an object with all of the values
 *
 * @example
 * ```typescript
 * const values = await getValues({
 *     somethingEnabled: false,
 *     someNumber: 42,
 * })
 *
 * console.log(values.somethingEnabled)
 * console.log(values.someNumber)
 *
 * values.someNumber++ // Does NOT modify GM stored value.
 *                     // Pass the return of this function to valuesProxy for that functionality
 * ```
 */
function getValues(defaults) {
    return new Promise(resolve => {
        const values = defaults;
        const optionsRetrieved = (() => {
            let object = {};
            for (const option of Object.keys(values)) {
                object[option] = false;
            }
            return object;
        })();
        const optionRetrieved = () => {
            if (Object.values(optionRetrieved).every(v => v)) {
                resolve(values);
            }
        };
        // Iterate over values
        for (const option of Object.keys(optionsRetrieved)) {
            // Get the option from GreaseMonkey
            GM.getValue(option).then(async (value) => {
                if (value !== undefined) {
                    // If the value is defined, update the values object
                    values[option] = value;
                    optionsRetrieved[option] = true;
                }
                else {
                    // If the value is undefined, set it to the default value from the values object
                    await GM.setValue(option, values[option]);
                    optionsRetrieved[option] = true;
                }
                optionRetrieved();
            });
        }
    });
}
exports.getValues = getValues;
/**
 * Get a Proxy that automatically updates GM variables.
 * There should generally only be one Proxy per option (eg. one proxy that controls `option1` and `option2`
 * and a different one that controls `option3` and `option4`).
 * This is because the returned Proxy doesn't update the value on get, only on set.
 * If multiple Proxies on the same values are being used to set, then a get Proxy
 * (`valuesGetProxy`) to get values might be a good idea
 *
 * @param values A values object, such as the one from `getValues`
 * @param callback Called with the Promise returned by `GM.setValue`
 * @returns A Proxy from `values` that updates the GM value on set
 * @example
 * ```typescript
 * const values = valuesProxy(
 *   await getValues({
 *     message: 'Hello, World!',
 *   })
 * )
 *
 * values.message = 'Hello!' // Runs GM.setValue('message', 'Hello!')
 * console.log(values.message) // Logs 'Hello!'. Does NOT run GM.getValue
 * ```
 */
function valuesProxy(values, callback) {
    /** Handle sets to the values object */
    const handler = {
        set(target, prop, value) {
            if (prop in target) {
                const gmSetPromise = GM.setValue(prop, value);
                if (callback)
                    callback(gmSetPromise);
                return Reflect.set(target, prop, value);
            }
            return false;
        },
    };
    return new Proxy(values, handler);
}
exports.valuesProxy = valuesProxy;
/**
 * Get a Proxy that wraps `GM.getValue` for better typing.
 * Useful when a value may be modified by multiple different sources,
 * meaning the value will need to be retrieved from GM every time.
 * This should not be used if values are only being modified by one source
 *
 * @param values A values object, such as the one returned from `getValues`
 * @returns A Proxy using the keys of `values` that wraps `GM.getValue`
 * @example
 * ```typescript
 * const values = valuesProxy(
 *   await getValues({
 *     message: 'Hello, World!',
 *   })
 * )
 *
 * const valuesGet = valuesGetProxy(values)
 *
 * console.log(await valuesGet.message) // Logs the result of GM.getValue('message')
 * ```
 */
function valuesGetProxy(values) {
    /** Handle gets to the values object */
    const handler = {
        get(target, prop) {
            return new Promise((resolve, reject) => {
                // Check if the property is a part of the passed values
                if (prop in target) {
                    GM.getValue(prop).then(value => {
                        // Resolve with the value if it's defined
                        if (value !== undefined)
                            resolve(value);
                        else
                            reject();
                    });
                }
                else {
                    reject();
                }
            });
        },
        /** Proxy isn't meant for setting, so do nothing */
        set() {
            return false;
        },
    };
    return new Proxy(values, handler);
}
exports.valuesGetProxy = valuesGetProxy;
/**
 * Deletes a value from a values object.
 * This is only useful if you're using TypeScript or your editor has typing support.
 * If that doesn't describe your use case, then use `GM.deleteValue` instead.
 *
 * @param values A values object, such as the one returned from `getValues`
 * @param toDelete The value to delete
 * @returns A Promise that resolves with a new object without the deleted type,
 * or rejects with nothing if the deletion failed
 */
function deleteValue(values, toDelete) {
    return new Promise(async (resolve, reject) => {
        if (toDelete in values) {
            await GM.deleteValue(toDelete);
            delete values[toDelete];
            resolve(values);
        }
        reject();
    });
}
exports.deleteValue = deleteValue;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./lib/index.js");
/******/ 	window.GreaseTools = __webpack_exports__;
/******/ 	
/******/ })()
;