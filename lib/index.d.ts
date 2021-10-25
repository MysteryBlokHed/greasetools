/// <reference types="greasemonkey" />
export declare type ConfigObject<ConfigOptions extends string> = {
    [option in ConfigOptions]: GM.Value;
};
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
export declare function getConfigValues<ConfigOptions extends string>(defaults: ConfigObject<ConfigOptions>): Promise<typeof defaults>;
/**
 * Get a Proxy that automatically updates GM variables.
 * There should generally only be one Proxy per config option (eg. one proxy that controls `option1` and `option2`
 * and a different one that controls `option3` and `option4`).
 * This is because the returned Proxy doesn't update the value on get, only on set
 *
 * @param config A config object, such as the one from `getConfigValues`
 * @param callback Called with the Promise returned by `GM.setValue`
 * @returns A Proxy from `config` that updates the GM config on set
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
export declare function configProxy<ConfigOptions extends string>(config: ConfigObject<ConfigOptions>, callback?: (gmSetPromise: Promise<void>) => void): typeof config;
