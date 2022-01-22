export * from './banner';
export * from './xhr';
export * from './values';
/** Used by functions to check if grants are present */
export declare function checkGrants(...grants: readonly ('setValue' | 'getValue' | 'deleteValue' | 'listValues' | 'xmlHttpRequest')[]): boolean;

export as namespace GreaseTools;
