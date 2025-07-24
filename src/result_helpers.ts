import { Result } from "./result.ts";

/**
 * Returns an `Ok` result containing the especified value.
 * Equivalent to {@linkcode Result.Ok}.
 */
export const Ok = Result.Ok;

/**
 * Returns an `Err` result containing the especified cause as its value.
 * Equivalent to {@linkcode Result.Err}.
 */
export const Err = Result.Err;

/**
 * Type guard for checking if a value is an `Ok`.
 *
 * @template T The type of the value contained in the `Result` being checked.
 * @template E The type of the error expected to the `Result`.
 * @param {unknown} value The value to check.
 * @returns {value is Result<T, E>} `true` if value is an `Ok` result.
 */
export function isOk<T, E>(value: unknown): value is Result<T, E> {
  return value instanceof Result && value.isOk;
}

/**
 * Type guard for checking if a value is an `Err`.
 *
 * @template E The type of the error expected to the `Result`.
 * @param {unknown} value The value to check.
 * @returns {value is Result<never, E>} `true` if value is an `Err` result.
 */
export function isErr<E>(value: unknown): value is Result<never, E> {
  return value instanceof Result && value.isErr;
}

/** Adds support to "instanceof Ok". */
Object.defineProperty(Ok, Symbol.hasInstance, {
  value: <T, E>(instance: Result<T, E>): instance is Result<T, E> => {
    if (typeof instance !== "object") return false;
    return instance?.isOk || false;
  },
});

/** Adds support to "instanceof Err". */
Object.defineProperty(Err, Symbol.hasInstance, {
  value: <T, E>(instance: Result<T, E>): instance is Result<never, E> => {
    if (typeof instance !== "object") return false;
    return instance?.isErr || false;
  },
});
