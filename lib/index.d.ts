/// <reference types="greasemonkey" />
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
export declare function getConfigValues<ConfigOptions extends string>(defaults: {
    [option in ConfigOptions]: GM.Value;
}): Promise<typeof defaults>;
/**
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
export declare function configProxy<ConfigOptions extends string>(config: {
    [option in ConfigOptions]: GM.Value;
}, callback?: (gmSetPromise: Promise<void>) => void): { [option in ConfigOptions]: GM.Value; };
