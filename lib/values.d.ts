/// <reference types="greasemonkey" />
export declare type ValuesObject<Keys extends string = string> = Record<Keys, GM.Value>;
export declare type ValuesPromiseObject<Keys extends string = string> = Record<Keys, Promise<GM.Value>>;
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
export declare function getValues<Keys extends string>(defaults: ValuesObject<Keys>, id?: string): Promise<ValuesObject<Keys>>;
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
export declare function getAllValues(): Promise<ValuesObject>;
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
export declare function valuesProxy<Keys extends string>(values: ValuesObject<Keys>, id?: string, callback?: (gmSetPromise: Promise<void>) => void): ValuesObject<Keys>;
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
export declare function valuesGetProxy<Keys extends string>(values: ValuesObject<Keys>, id?: string): ValuesPromiseObject<Keys>;
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
export declare function deleteValue<Keys extends string, ToDelete extends Keys>(values: ValuesObject<Keys>, toDelete: ToDelete, id?: string): Promise<Omit<ValuesObject<Keys>, ToDelete>>;
