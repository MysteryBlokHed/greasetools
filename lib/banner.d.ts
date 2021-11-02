export declare type MetadataKey = 'description' | 'exclude' | 'grant' | 'icon' | 'include' | 'match' | 'name' | 'namespace' | 'noframes' | 'require' | 'resource' | 'run-at' | 'version';
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
export default function genBanner(metaValues: {
    [key in MetadataKey]?: string | (string | undefined)[];
}, spacing?: number): string;
