/// <reference types="greasemonkey" />
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
export declare function getConfigValues<ConfigOptions extends string>(defaults: {
    [option in ConfigOptions]: GM.Value;
}): Promise<{ [option in ConfigOptions]: GM.Value; }>;
