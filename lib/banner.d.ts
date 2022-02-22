declare type MetadataValue = string | readonly (string | undefined)[] | undefined;
export declare type MetadataObject = Partial<Record<'description' | 'exclude' | 'grant' | 'icon' | 'include' | 'match' | 'name' | 'namespace' | 'noframes' | 'require' | 'resource' | 'run-at' | 'version', MetadataValue>> & Record<string, MetadataValue>;
/**
 * Generate a UserScript metadata comment from an object.
 * Falsey values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param metaValues Properties to add to metadata
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @param start What to put at the start of the banner. Defaults to `'// ==UserScript=='`
 * @param end What to put at the end of the banner. Defaults to `'// ==/UserScript=='`
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
export declare function genBanner(metaValues: MetadataObject, spacing?: number, start?: string, end?: string): string;
export {};
