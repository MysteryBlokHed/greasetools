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
export function getConfigValues<ConfigOptions extends string>(defaults: {
  [option in ConfigOptions]: GM.Value
}) {
  return new Promise<typeof defaults>(resolve => {
    const config = defaults

    let optionsRetrieved: { [option in ConfigOptions]?: boolean } = {}

    for (const option of Object.keys(config) as ConfigOptions[]) {
      optionsRetrieved[option] = false
    }

    const optionRetrieved = () => {
      if (Object.values(optionRetrieved).every(v => v)) {
        resolve(config)
      }
    }

    // Iterate over config options
    for (const option of Object.keys(optionsRetrieved) as ConfigOptions[]) {
      // Get the option from GreaseMonkey
      GM.getValue(option).then(async value => {
        if (value !== undefined) {
          // If the value is defined, update the config object
          config[option] = value
          optionsRetrieved[option] = true
        } else {
          // If the value is undefined, set it to the default value from the config object
          await GM.setValue(option, config[option])
          optionsRetrieved[option] = true
        }
        optionRetrieved()
      })
    }
  })
}
