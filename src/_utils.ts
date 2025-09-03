/**
 * Returns the general type of an array.
 *
 * @param {unknown[]} array
 * The array to have its type checked.
 *
 * @returns {string}
 * The type of the array.
 */
export function arrayType(array: unknown[]): string {
  const firstItem = array[0];
  const lastItem = array[array.length - 1];
  return (typeof firstItem === typeof lastItem) ? typeof firstItem : "any";
}
