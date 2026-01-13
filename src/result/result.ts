// result/result.ts

import { None, type Option, Some } from "../option/mod.ts";

/**
 * The result of some operation.
 *
 * @template O Type of the success value.
 * @template E Type of the error value.
 */
export class Result<O, E> {
  /**
   * Creates a `Result` from the specified "type".
   *
   * @param variant - The "type" adopted by `Result`.
   */
  private constructor(private readonly variant: Ok<O> | Err<E>) {}

  /**
   * Creates a `Result` that contains a success value.
   *
   * @param value - The value for the `Result`.
   * @returns An `Ok` variant of `Result`.
   */
  public static Ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(new Ok(value));
  }

  /**
   * Creates a `Result` that contains an error value.
   *
   * @param value - The value for the `Result`.
   * @returns An `Err` variant of `Result`.
   */
  public static Err<T>(value: T): Result<never, T> {
    return new Result<never, T>(new Err(value));
  }

  /**
   * The `Result` contains a success value.
   *
   * @returns `true` if it contains a success value, otherwise `false`.
   */
  public get isOk(): boolean {
    return this.variant instanceof Ok;
  }

  /**
   * The `Result` contains an error value.
   *
   * @returns `true` if it contains an error value, otherwise `false`.
   */
  public get isErr(): boolean {
    return this.variant instanceof Err;
  }

  /**
   * Converts the `Ok` value of the `Result` into an `Option`.
   *
   * @returns An `Option` containing the value from the `Ok` variant.
   */
  public get ok(): Option<O> {
    return this.isOk ? Some(this.unwrap()) : None;
  }

  /**
   * Converts the `Err` value of the `Result` into an `Option`.
   *
   * @returns An `Option` containing the value from the `Err` variant.
   */
  public get error(): Option<E> {
    return this.isErr ? Some(this.unwrapErr()) : None;
  }

  /**
   * Returns the value of `Ok`, throwing an *exception* if it's `Err`.
   *
   * @throws {TypeError} If the `Result` is `Err`.
   * @returns The value of `Ok`.
   */
  public unwrap(): O | never {
    if (this.isOk) return this.variant.value as O;
    throw new TypeError("Trying to get a success value for Err");
  }

  /**
   * Returns the value of `Err`, throwing an *exception* if it's `Ok`.
   *
   * @throws {TypeError} If the `Result` is `Ok`.
   * @returns The value of `Err`.
   */
  public unwrapErr(): E | never {
    if (this.isErr) return this.variant.value as E;
    throw new TypeError("Trying to get an error value for Ok");
  }

  /**
   * Returns the value of `Ok`, if present, or the _default_.
   *
   * @param defaultValue - Value used as default if needed.
   * @returns The contained value of `Ok` or the default.
   */
  public unwrapOr(defaultValue: O): O {
    return this.isOk ? this.unwrap() : defaultValue;
  }

  /**
   * Applies a function to the value of the `Ok` variant, if present, and
   * returns a new `Ok` containing the result.
   *
   * @param fn - A function that transforms the value.
   * @returns A new `Ok` with the transformed value.
   */
  public map<U>(fn: (value: O) => U): Result<U, E> {
    if (this.isErr) return this as unknown as Result<U, E>;
    return Result.Ok(fn(this.unwrap()));
  }

  /**
   * Applies a function to the value of the `Err` variant, if present, and
   * returns a new `Err` containing the result.
   *
   * @param fn - A function that transforms the value.
   * @returns A new `Err` with the transformed value.
   */
  public mapErr<U>(fn: (value: E) => U): Result<O, U> {
    if (this.isOk) return this as unknown as Result<O, U>;
    return Result.Err(fn(this.unwrapErr()));
  }

  /**
   * Matches the variant of `Result`, executing the apropriate _handler_.
   *
   * @template R Type of the value returned by the handler.
   * @param handlers - Object with handlers for each variant.
   * @returns Any value from the executed handler.
   */
  public match<R>({ Ok, Err }: MatchOptions<O, E, R>): R {
    return this.isOk ? Ok(this.unwrap()) : Err(this.unwrapErr());
  }
}

/**
 * Describes handlers for every variant of `Result`.
 *
 * @template O Type of the success value.
 * @template E Type of the error value.
 * @template Ret Type of return value for all handlers.
 */
interface MatchOptions<O, E, Ret> {
  Ok: (value: O) => Ret;
  Err: (value: E) => Ret;
}

/**
 * Data class.
 *
 * Represents a success value.
 *
 * @template T Type of the value.
 */
class Ok<T> {
  public constructor(public readonly value: T) {}
}

/**
 * Data class.
 *
 * Represents an error value.
 *
 * @template T Type of the value.
 */
class Err<T> {
  public constructor(public readonly value: T) {}
}

export default Result;
