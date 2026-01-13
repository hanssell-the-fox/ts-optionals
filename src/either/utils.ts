// either/utils.ts

import Either from "./either.ts";

/**
 * Creates an `Either` that contains a left value.
 *
 * @param value - The value for `Either`.
 * @returns A `Left` variant of `Either`.
 */
export const Left: typeof Either.Left = Either.Left;

/**
 * Creates an `Either` that contains a right value.
 *
 * @param value - The value for `Either`.
 * @returns A `Right` variant of `Either`.
 */
export const Right: typeof Either.Right = Either.Right;
