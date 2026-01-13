// result/utils.ts

import Result from "./result.ts";

/**
 * Creates a `Result` containing a success value.
 *
 * @param value - The value to be contained by `Result`.
 * @returns A `Result` of variant `Ok`.
 */
export const Ok: typeof Result.Ok = Result.Ok;

/**
 * Creates a `Result` containing an error value.
 *
 * @param value - The value to be contained by `Result`.
 * @returns A `Result` of variant `Err`.
 */
export const Err: typeof Result.Err = Result.Err;
