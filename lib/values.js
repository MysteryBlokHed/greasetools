"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteValue = exports.valuesGetProxy = exports.valuesProxy = exports.getAllValues = exports.getValues = void 0;
const _1 = require(".");
/** Ensure that the values passed are all strings for use with `localStorage` */
function ensureString(values) {
    for (const value of Object.values(values)) {
        if (typeof value !== 'string')
            throw TypeError('Only string is supported for values when localStorage is being used');
    }
}
const prefixKey = (key, prefix) => prefix ? `${prefix}.${key}` : key;
/**
 * Requires the `GM.getValue` grant or falls back to using localStorage.
 * Retrieves values from GreaseMonkey based on the generic type provided
 *
 * @param defaults The default values if they are undefined.
 * Each option will be set to a key from this if it does not exist
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
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
function getValues(defaults, id) {
    return new Promise((resolve, reject) => {
        const values = defaults;
        const grants = (0, _1.checkGrants)('getValue');
        if (!grants)
            ensureString(Object.values(values));
        if (grants) {
            /**
             * Returns a promise with the value returned from GM.getValue.
             * If no value exists, sets the value to the provided default
             * and returns that
             *
             * @returns A Promise with the original key and the retrieved value
             */
            const getWithDefault = (key, defaultValue, id) => {
                return new Promise((resolve, reject) => {
                    const prefix = prefixKey(key, id);
                    GM.getValue(prefix)
                        .then(value => value
                        ? resolve([key, value])
                        : GM.setValue(prefix, defaultValue)
                            .then(() => resolve([key, defaultValue]))
                            .catch(reason => reject(reason)))
                        .catch(reason => reject(reason));
                });
            };
            const promises = [];
            for (const [key, value] of Object.entries(defaults)) {
                promises.push(getWithDefault(key, value, id));
            }
            Promise.all(promises)
                .then(retrievedValues => {
                const returnedValues = {};
                for (const [key, value] of retrievedValues) {
                    returnedValues[key] = value;
                }
                resolve(returnedValues);
            })
                .catch(reason => reject(reason));
        }
        else {
            const returnedValues = {};
            for (const [key, defaultValue] of Object.entries(defaults)) {
                const value = localStorage.getItem(key);
                if (value === null)
                    localStorage.setItem(key, defaultValue);
                returnedValues[key] = value ?? defaultValue;
            }
            resolve(returnedValues);
        }
    });
}
exports.getValues = getValues;
/**
 * Requires the `GM.getValue` and `GM.listValues` grants or falls back to using localStorage.
 * Returns a values object containing every saved value for the UserScript
 *
 * @returns A Promise that resolves to the defined values or rejects with nothing.
 * @example
 * ```typescript
 * // Logs all key/value pairs from GreaseMonkey
 * const allValues = await getAllValues()
 * for (const [key, value] of Object.entries(allValues)) {
 *   console.log(key, value)
 * }
 * ```
 */
async function getAllValues() {
    const valueNames = await (async () => {
        // Using localStorage
        if (!(0, _1.checkGrants)('getValue', 'listValues'))
            return Object.keys(localStorage);
        // Using GreaseMonkey
        return GM.listValues();
    })();
    const defaults = (() => {
        const emptyDefault = {};
        for (const value of valueNames)
            emptyDefault[value] = '';
        return emptyDefault;
    })();
    return getValues(defaults);
}
exports.getAllValues = getAllValues;
/**
 * Requires the `GM.setValue` grant or falls back to using localStorage.
 * Get a Proxy that automatically updates values.
 * There should generally only be one Proxy per option (eg. one proxy that controls `option1` and `option2`
 * and a different one that controls `option3` and `option4`).
 * This is because the returned Proxy doesn't update the value on get, only on set.
 * If multiple Proxies on the same values are being used to set, then a get Proxy
 * (`valuesGetProxy`) to get values might be a good idea
 *
 * @param values A values object, such as the one from `getValues`
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
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
function valuesProxy(values, id, callback) {
    const grants = (0, _1.checkGrants)('setValue');
    /** Handle sets to the values object */
    const handler = {
        set(target, prop, value) {
            const prefix = prefixKey(prop, id);
            if (prop in target) {
                // Using GreaseMonkey
                if (grants) {
                    const gmSetPromise = GM.setValue(prefix, value);
                    if (callback)
                        callback(gmSetPromise);
                    // Using localStorage
                }
                else {
                    ensureString([value]);
                    localStorage.setItem(prefix, value);
                }
                return Reflect.set(target, prop, value);
            }
            return false;
        },
    };
    return new Proxy(values, handler);
}
exports.valuesProxy = valuesProxy;
/**
 * Requires the `GM.getValue` grant or falls back to using localStorage.
 * Get a Proxy that wraps `GM.getValue` for better typing.
 * Useful when a value may be modified by multiple different sources,
 * meaning the value will need to be retrieved from GM every time.
 * This should not be used if values are only being modified by one source
 *
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
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
function valuesGetProxy(values, id) {
    const grants = (0, _1.checkGrants)('getValue');
    /** Handle gets to the values object */
    const handler = {
        get(target, prop) {
            return new Promise((resolve, reject) => {
                const prefix = prefixKey(prop, id);
                // Check if the property is a part of the passed values
                if (prop in target) {
                    // Using GreaseMonkey
                    if (grants) {
                        GM.getValue(prefix).then(value => {
                            // Resolve with the value if it's defined
                            if (value !== undefined)
                                resolve(value);
                            else
                                reject();
                        });
                        // Using localStorage
                    }
                    else {
                        const value = localStorage.getItem(prefix);
                        if (value !== null)
                            resolve(value);
                        else
                            reject();
                    }
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
 * Requires the `GM.deleteValue` grant or falls back to localStorage.
 * Deletes a value from a values object.
 * This is only useful if you're using TypeScript or your editor has typing support.
 * If that doesn't describe your use case, then use `GM.deleteValue` instead
 *
 * @param values A values object, such as the one returned from `getValues`
 * @param toDelete The value to delete
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
 * @returns A Promise that resolves with a new object without the deleted type,
 * or rejects with nothing if the deletion failed
 */
function deleteValue(values, toDelete, id) {
    return new Promise(async (resolve, reject) => {
        const prefix = prefixKey(toDelete, id);
        if (toDelete in values) {
            // Using GreaseMonkey
            if ((0, _1.checkGrants)('deleteValue'))
                await GM.deleteValue(prefix);
            // Using localStorage
            else
                localStorage.removeItem(prefix);
            delete values[toDelete];
            resolve(values);
        }
        reject();
    });
}
exports.deleteValue = deleteValue;
