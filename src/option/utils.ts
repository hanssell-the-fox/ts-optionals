// option/utils.ts

import Option from "./option.ts";

/**
 * Creates an `Option` that contains a value.
 *
 * @param value - The value for the `Option`.
 * @returns A `Some` variant of `Option`.
 */
export const Some: typeof Option.Some = Option.Some;

/**
 * Creates an empty `Option`.
 *
 * @returns An `Option` without value.
 */
export const None: Option<never> = Option.None();
