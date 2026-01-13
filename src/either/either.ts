// either/either.ts

import { None, type Option, Some } from "../option/mod.ts";

/**
 * Represents two possible values.
 *
 * @template L Type of the left value.
 * @template R Type of the right value.
 */
export class Either<L, R> {
  /**
   * Creates an instance of `Either` from the specified "type".
   *
   * @param type - The "type" adopted by `Either`.
   */
  private constructor(private readonly variant: Left<L> | Right<R>) {}

  /**
   * Creates an `Either` that contains a left value.
   *
   * @param value - The value for `Either`.
   * @returns A `Left` variant of `Either`.
   */
  public static Left<T>(value: T): Either<T, never> {
    return new Either<T, never>(new Left(value));
  }

  /**
   * Creates an `Either` that contains a right value.
   *
   * @param value - The value for `Either`.
   * @returns A `Right` variant of `Either`.
   */
  public static Right<T>(value: T): Either<never, T> {
    return new Either<never, T>(new Right(value));
  }

  /**
   * The `Either` contains a left value.
   *
   * @returns `true` if it contains a left value, otherwise `false`.
   */
  public get isLeft(): boolean {
    return this.variant instanceof Left;
  }

  /**
   * The `Either` contains a right value.
   *
   * @returns `true` if it contains a right value, otherwise `false`.
   */
  public get isRight(): boolean {
    return this.variant instanceof Right;
  }

  /**
   * Converts the `Left` left value of `Either` into an `Option`.
   *
   * @returns An `Option` with the value from the `Left` variant.
   */
  public get left(): Option<L> {
    return this.isLeft ? Some(this.unwrapLeft()) : None;
  }

  /**
   * Converts the `Right` value of the `Either` into an `Option`.
   *
   * @returns An `Option` with the value from the `Right` variant.
   */
  public get right(): Option<R> {
    return this.isRight ? Some(this.unwrapRight()) : None;
  }

  /**
   * Returns the value of `Left`, throwing an *exception* if it's
   * `Right`.
   *
   * @throws {TypeError} If the `Either` is `Right`.
   * @returns The value of `Left`.
   */
  public unwrapLeft(): L | never {
    if (this.isLeft) return this.variant.value as L;
    throw new TypeError("Trying to get a left value from Right");
  }

  /**
   * Returns the value of `Right`, throwing an *exception* if it's
   * `Left`.
   *
   * @throws {TypeError} If the `Either` is `Left`.
   * @returns The value of `Right`.
   */
  public unwrapRight(): R | never {
    if (this.isRight) return this.variant.value as R;
    throw new TypeError("Trying to get a left value from Left");
  }

  /**
   * Returns the value of `Left`, if present, or the _default_.
   *
   * @param defaultValue - Value used as default if needed.
   * @returns The value of `Left` or the default.
   */
  public unwrapLeftOr(defaultValue: L): L {
    if (this.isRight) return defaultValue;
    return this.variant.value as L;
  }

  /**
   * Returns the value of `Right` or the provided _default_.
   *
   * @param defaultValue - Value used as default if needed.
   * @returns The value of `Right` or the default.
   */
  public unwrapRightOr(defaultValue: R): R {
    if (this.isLeft) return defaultValue;
    return this.variant.value as R;
  }

  /**
   * Applies a function to the value of `Left`, if present, and returns a new
   * `Left` containing the result.
   *
   * @param fn - A function transforms the value.
   * @returns A new `Left` with the transformed value.
   */
  public mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    if (this.isRight) return this as unknown as Either<U, R>;
    return Either.Left(fn(this.unwrapLeft()));
  }

  /**
   * Applies a function to the value of `Right`, if present, and returns a new
   * `Right` containing the result.
   *
   * @param fn - A function that transforms the value.
   * @returns A new `Right` with the transformed value.
   */
  public mapRight<U>(fn: (value: R) => U): Either<L, U> {
    if (this.isLeft) return this as unknown as Either<L, U>;
    return Either.Right(fn(this.unwrapRight()));
  }

  /**
   * Applies a function to the value of `Either`, and returns a new `Either`
   * from the corresponding variant with the result.
   *
   * @param fn - A function that transforms the value.
   * @returns A new `Either` with the transformed value.
   */
  public map<U>(fn: (value: L | R) => U): Either<U, R> | Either<L, U> {
    return this.isLeft
      ? Either.Left(fn(this.unwrapLeft()))
      : Either.Right(fn(this.unwrapRight()));
  }

  /**
   * Matches the variant of `Either`, executing the apropriate _handler_.
   *
   * @template R Type of the value returned by the handler.
   * @param handlers - Object with handlers for each variant.
   * @returns Any value from the executed handler.
   */
  public match<U>({ Left, Right }: MatchOptions<L, R, U>): U {
    if (this.isLeft) return Left(this.unwrapLeft());
    return Right(this.unwrapRight());
  }
}

/**
 * Describes handlers for every variant of `Either`.
 *
 * @template L Type of the left value.
 * @template R Type of the right value.
 * @template Ret Type of return value for all handlers.
 */
interface MatchOptions<L, R, Ret> {
  Left: (value: L) => Ret;
  Right: (value: R) => Ret;
}

/**
 * Data class.
 *
 * Represents a left value.
 *
 * @template T Type of the value.
 */
class Left<T> {
  public constructor(public readonly value: T) {}
}

/**
 * Data class.
 *
 * Represents a right value.
 *
 * @template T Type of the value.
 */
class Right<T> {
  public constructor(public readonly value: T) {}
}

export default Either;
