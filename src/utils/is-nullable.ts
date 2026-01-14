// utils/is-nullable.ts

/**
 * Checks if a _value_ is either `null` or `undefined`.
 *
 * @param value - A value to check.
 * @returns `true` if nullable, `false` otherwise.
 */
export function isNullable(value: unknown): value is null | undefined {
  return value == null;
}
