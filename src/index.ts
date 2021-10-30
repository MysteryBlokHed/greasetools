export type ConfigObject<ConfigOptions extends string> = {
  [option in ConfigOptions]: GM.Value
}
export type ConfigPromiseObject<ConfigOptions extends string> = {
  [option in ConfigOptions]: Promise<GM.Value>
}

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
export function getConfigValues<ConfigOptions extends string>(
  defaults: ConfigObject<ConfigOptions>
): Promise<ConfigObject<ConfigOptions>> {
  return new Promise<ConfigObject<ConfigOptions>>(resolve => {
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
export function configProxy<ConfigOptions extends string>(
  config: ConfigObject<ConfigOptions>,
  callback?: (gmSetPromise: Promise<void>) => void
): ConfigObject<ConfigOptions> {
  /** Handle sets to the config object */
  const handler: ProxyHandler<ConfigObject<ConfigOptions>> = {
    set(target, prop: ConfigOptions, value: GM.Value) {
      if (prop in target) {
        const gmSetPromise = GM.setValue(prop, value)
        if (callback) callback(gmSetPromise)
        target[prop] = value
        return true
      }
      return false
    },
  }

  return new Proxy(config, handler)
}

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
export function configGetProxy<ConfigOptions extends string>(
  config: ConfigObject<ConfigOptions>
): ConfigPromiseObject<ConfigOptions> {
  /** Handle gets to the config object */
  const handler: ProxyHandler<ConfigObject<ConfigOptions>> = {
    get(target, prop: ConfigOptions): Promise<GM.Value> {
      return new Promise((resolve, reject) => {
        // Check if the property is a part of the passed config
        if (prop in target) {
          GM.getValue(prop).then(value => {
            // Resolve with the value if it's defined
            if (value !== undefined) resolve(value)
            else reject()
          })
        } else {
          reject()
        }
      })
    },

    /** Proxy isn't meant for setting, so do nothing */
    set() {
      return false
    },
  }

  return new Proxy(
    config,
    handler
  ) as unknown as ConfigPromiseObject<ConfigOptions>
}
