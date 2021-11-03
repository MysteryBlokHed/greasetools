/// <reference types="greasemonkey" />
export declare type ValuesObject<Values extends string> = {
    [option in Values]: GM.Value;
};
export declare type ValuesPromiseObject<Values extends string> = {
    [option in Values]: Promise<GM.Value>;
};
/**
 * Requires the `GM.getValue` grant.
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
export declare function getValues<Values extends string>(defaults: ValuesObject<Values>): Promise<ValuesObject<Values>>;
/**
 * Requires the `GM.setValue` grant.
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
export declare function valuesProxy<Values extends string>(values: ValuesObject<Values>, callback?: (gmSetPromise: Promise<void>) => void): ValuesObject<Values>;
/**
 * Requires the `GM.getValue` grant.
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
export declare function valuesGetProxy<Values extends string>(values: ValuesObject<Values>): ValuesPromiseObject<Values>;
/**
 * Requires the `GM.deleteValue` grant.
 * Deletes a value from a values object.
 * This is only useful if you're using TypeScript or your editor has typing support.
 * If that doesn't describe your use case, then use `GM.deleteValue` instead.
 *
 * @param values A values object, such as the one returned from `getValues`
 * @param toDelete The value to delete
 * @returns A Promise that resolves with a new object without the deleted type,
 * or rejects with nothing if the deletion failed
 */
export declare function deleteValue<Values extends string, ToDelete extends Values>(values: ValuesObject<Values>, toDelete: ToDelete): Promise<Omit<ValuesObject<Values>, ToDelete>>;
