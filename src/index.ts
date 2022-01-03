export * from './banner'
export * from './xhr'
export * from './values'

/** Used by functions to check if grants are present */
export function checkGrants(
  ...grants: (
    | 'setValue'
    | 'getValue'
    | 'deleteValue'
    | 'listValues'
    | 'xmlHttpRequest'
  )[]
): boolean {
  if (!GM) return false
  if (grants.some(grant => !(grant in GM))) return false
  return true
}
