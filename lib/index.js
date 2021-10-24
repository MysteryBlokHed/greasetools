"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configProxy = exports.getConfigValues = void 0;
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
 * Get a Proxy that automatically updates GM variables. This should generally only be used
 * when only one instance exists or when only one instance will be modifying values,
 * since getting a value does not update it
 *
 * @param config A config object, such as the one from `getConfigValues`
 * @param callback Called with the Promise returned by `GM.setValue`
 * @returns A Proxy to the config object passed that updates the GreaseMonkey config on set
 * @example
 * ```typescript
 * const config = configProxy(
 *   await getConfigValues({
 *     message: 'Hello, World'!,
 *   })
 * )
 *
 * config.message = 'Hello!' // Runs GM.setValue('message', 'Hello!')
 * ```
 */
function configProxy(config, callback) {
    /** Handle sets to the config object */
    const handler = {
        set(target, prop, value) {
            if (target.hasOwnProperty(prop)) {
                const gmSetPromise = GM.setValue(prop, value);
                if (callback)
                    callback(gmSetPromise);
                target[prop] = value;
                return true;
            }
            return false;
        },
    };
    return new Proxy(config, handler);
}
exports.configProxy = configProxy;
