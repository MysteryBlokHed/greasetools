"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigValues = void 0;
/**
 * Retrieves config options from GreaseMonkey based on the generic type provided
 *
 * @param defaults The default values for the config.
 * Each option will be set to a key from this if it does not exist
 * @returns A Promise that resolves to an object with all of the config options
 *
 * @example
 * ```
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
