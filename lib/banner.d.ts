/**
 * Get a UserScript banner from an object.
 * Undefined values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param props Properties to turn into a banner
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
export default function genBanner(props: {
    [key: string]: string | (string | undefined)[] | undefined;
}, spacing?: number): string;
