export type MetadataObject = Partial<
  Record<
    | 'description'
    | 'exclude'
    | 'grant'
    | 'icon'
    | 'include'
    | 'match'
    | 'name'
    | 'namespace'
    | 'noframes'
    | 'require'
    | 'resource'
    | 'run-at'
    | 'version',
    string | (string | undefined)[] | undefined
  >
>

/**
 * Generate a UserScript metadata comment from an object.
 * Falsey values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param metaValues Properties to add to metadata
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
export function genBanner(metaValues: MetadataObject, spacing = 12): string {
  let final = '// ==UserScript==\n'

  const format = (prop: string, value: string) =>
    `// @${prop}${' '.repeat(spacing - prop.length)}${value}\n`

  for (const [key, value] of Object.entries(metaValues)) {
    if (!value) continue

    if (typeof value === 'string') {
      final += format(key, value)
    } else {
      for (const val of value) {
        if (!val) continue
        final += format(key, val)
      }
    }
  }

  final += '// ==/UserScript==\n'
  return final
}
