
// ==UserScript==
// @name        greasetools
// @description Functions and other tools for GreaseMonkey UserScript development.
// @version     0.1.0
// @author      Adam Thompson-Sharpe
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
    /**
     *
     * @param prop Property name
     * @param value Value of the property
     * @returns Formatted version as a comment
     */
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
exports["default"] = genBanner;


/***/ }),

/***/ "./lib/config.js":
/*!***********************!*\
  !*** ./lib/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.configGetProxy = exports.configProxy = exports.getConfigValues = void 0;
/**
 * Retrieves config options from GreaseMonkey based on the generic type provided
 *
 * @param defaults The default values for the config.
 * Each option will be set to a key from this if it does not exist
 * @returns A Promise that resolves to an object with all of the config options
 *
 * @example
 * ```typescript
 * const config = await getConfigValues({
 *     somethingEnabled: false,
 *     someNumber: 42,
 * })
 *
 * console.log(config.somethingEnabled)
 * console.log(config.someNumber)
 *
 * config.someNumber++ // Does NOT modify GM stored value.
 *                     // Pass the return of this function to configProxy for that functionality
 * ```
 */
function getConfigValues(defaults) {
    return new Promise(resolve => {
        const config = defaults;
        let optionsRetrieved = {};
        for (const option of Object.keys(config)) {
            optionsRetrieved[option] = false;
        }
        const optionRetrieved = () => {
            if (Object.values(optionRetrieved).every(v => v)) {
                resolve(config);
            }
        };
        // Iterate over config options
        for (const option of Object.keys(optionsRetrieved)) {
            // Get the option from GreaseMonkey
            GM.getValue(option).then(async (value) => {
                if (value !== undefined) {
                    // If the value is defined, update the config object
                    config[option] = value;
                    optionsRetrieved[option] = true;
                }
                else {
                    // If the value is undefined, set it to the default value from the config object
                    await GM.setValue(option, config[option]);
                    optionsRetrieved[option] = true;
                }
                optionRetrieved();
            });
        }
    });
}
exports.getConfigValues = getConfigValues;
/**
 * Get a Proxy that automatically updates GM variables.
 * There should generally only be one Proxy per config option (eg. one proxy that controls `option1` and `option2`
 * and a different one that controls `option3` and `option4`).
 * This is because the returned Proxy doesn't update the value on get, only on set.
 * If multiple Proxies on the same config options are being used to set, then a get Proxy
 * (`configGetProxy`) to get values might be a good idea
 *
 * @param config A config object, such as the one from `getConfigValues`
 * @param callback Called with the Promise returned by `GM.setValue`
 * @returns A Proxy from `config` that updates the GM config on set
 * @example
 * ```typescript
 * const config = configProxy(
 *   await getConfigValues({
 *     message: 'Hello, World!',
 *   })
 * )
 *
 * config.message = 'Hello!' // Runs GM.setValue('message', 'Hello!')
 * console.log(config.message) // Logs 'Hello!'. Does NOT run GM.getValue
 * ```
 */
function configProxy(config, callback) {
    /** Handle sets to the config object */
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
    return new Proxy(config, handler);
}
exports.configProxy = configProxy;
/**
 * Get a Proxy that wraps `GM.getValue` for better typing.
 * Useful when a config value may be modified by multiple different sources,
 * meaning the value will need to be retrieved from GM every time.
 * This should not be used if config values are only being modified by one source
 *
 * @param config A config object, such as the one returned from `getConfigValues`
 * @returns A Proxy using the keys of `config` that wraps `GM.getValue`
 * @example
 * ```typescript
 * const config = configProxy(
 *   await getConfigValues({
 *     message: 'Hello, World!',
 *   })
 * )
 *
 * const configGet = configGetProxy(config)
 *
 * console.log(await configGet.message) // Logs the result of GM.getValue('message')
 * ```
 */
function configGetProxy(config) {
    /** Handle gets to the config object */
    const handler = {
        get(target, prop) {
            return new Promise((resolve, reject) => {
                // Check if the property is a part of the passed config
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
    return new Proxy(config, handler);
}
exports.configGetProxy = configGetProxy;


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
__exportStar(__webpack_require__(/*! ./banner */ "./lib/banner.js"), exports);
__exportStar(__webpack_require__(/*! ./config */ "./lib/config.js"), exports);


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