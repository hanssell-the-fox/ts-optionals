/**
 * Returns the general type of an array.
 *
 * @param {unknown[]} array The array to have its type checked.
 * @returns {string} The type of the array.
 */
export function getArrayType(array: unknown[]): string {
  const firstItem = array[0];
  return (array.every((item) => typeof item === typeof firstItem))
    ? typeof firstItem
    : "unknown";
}
