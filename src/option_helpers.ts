import { Option } from "./option.ts";

/**
 * Returns an `Option` without value.
 *
 * Equivalent to {@linkcode Option.None}
 *
 * @returns {Option<never>} An instance of `Option` that does not have a value.
 */
export function None(): Option<never> {
  return Option.None();
}

/**
 * Wraps a value into an `Option`.
 *
 * Equivalent to {@linkcode Option.Some}
 *
 * @template T The type of the value to wrap.
 * @param {T} value - The value to wrap into an `Option`.
 * @returns {Option<T>} An `Option` containing the wrappend value.
 */
export function Some<T>(value: T): Option<T> {
  return Option.Some<T>(value);
}

/**
 * Type guard for checking if a value is a `Some`.
 *
 * @template T The type of the value contained in the `Option` being checked.
 * @param {unknown} value - The value to check.
 * @returns {value is Option<T>} `true` if value is an `Option` with a value.
 */
export function isSome<T>(value: unknown): value is Option<T> {
  return value instanceof Option && value.isSome;
}

/**
 * Type guard for checking if a value is a `None`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is Option<never>} `true` if the value is an `Option` with no value.
 */
export function isNone(value: unknown): value is Option<never> {
  return value instanceof Option && value.isNone;
}

/** Adds support to "instanceof None". */
Object.defineProperty(None, Symbol.hasInstance, {
  value: <T>(instance: Option<T>): instance is Option<never> => {
    if (typeof instance !== "object") return false;
    return instance?.isNone || false;
  },
});

/** Adds support to "instanceof Some". */
Object.defineProperty(Some, Symbol.hasInstance, {
  value: <T>(instance: Option<T>): instance is Option<T> => {
    if (typeof instance !== "object") return false;
    return instance?.isSome || false;
  },
});
