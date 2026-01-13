// option/option.ts

/**
 * Represents an optional value.
 *
 * @template T Type of the contained value.
 */
export class Option<T> {
  /**
   * Creates an `Option` from the specified "type".
   *
   * @param variant - The "type" adopted by `Option`.
   */
  private constructor(private readonly variant: Some<T> | None) {}

  /**
   * Creates an `Option` that contains a value.
   *
   * @param value - The value for the `Option`.
   * @returns A `Some` variant of `Option`.
   */
  public static Some<T>(value: T): Option<T> {
    return new Option(new Some(value));
  }

  /**
   * Creates an empty `Option`.
   *
   * @returns An `Option` without value.
   */
  public static None(): Option<never> {
    return new Option(new None());
  }

  /**
   * The `Option` contains a value.
   *
   * @returns `true` if it contains some value, otherwise `false`.
   */
  public get isSome(): boolean {
    return this.variant instanceof Some;
  }

  /**
   * The `Option` is empty.
   *
   * @returns `true` if it has no value, otherwise `false`.
   */
  public get isNone(): boolean {
    return this.variant instanceof None;
  }

  /**
   * Returns the value of `Some`, throwing an *exception* if it's `None`.
   *
   * @throws {TypeError} If the `Option` is `None`.
   * @returns The value of `Some`.
   */
  public unwrap(): T | never {
    if (this.isNone) throw new TypeError("Trying to get a value from None");
    return (this.variant as Some<T>).value;
  }

  /**
   * Returns the value of `Some`, if present, or the provided _default_.
   *
   * @param defaultValue - A default value.
   * @returns The value from `Some` or the default.
   */
  public unwrapOr(defaultValue: T): T {
    if (this.isNone) return defaultValue;
    return (this.variant as Some<T>).value;
  }

  /**
   * Applies a function to the value of `Some`, if present, and returns a new
   * `Option` containing the result.
   *
   * @param fn - Function that transforms the value.
   * @returns A new `Some` with the transformed value.
   */
  public map<U>(fn: (value: T) => U): Option<U> {
    if (this.isNone) return this as unknown as Option<U>;
    return Option.Some(fn(this.unwrap()));
  }

  /**
   * Matches the variant of `Option`, executing the apropriate _handler_.
   *
   * @template R Type of the value returned by the handler.
   * @param handlers - Object with handlers for each variant.
   * @returns Any value from the executed handler.
   */
  public match<R>({ Some, None }: MatchOptions<T, R>): R {
    return this.isNone ? None() : Some(this.unwrap());
  }
}

/**
 * Describes handlers for every variant of `Option`.
 *
 * @template T Type of the contained value.
 * @template Ret Type of the return value for all handlers.
 */
interface MatchOptions<T, Ret> {
  Some: (value: T) => Ret;
  None: () => Ret;
}

/**
 * Data class.
 *
 * Represents a value.
 *
 * @template T Type of the value.
 */
class Some<T> {
  public constructor(public readonly value: T) {}
}

/**
 * Data class.
 *
 * Represents no value.
 */
class None {
  public constructor() {
    if (None.instance) return None.instance;
  }

  /**
   * Store an instance of None, that's used every time a new `None` is needed
   * to avoid creating new "empty" instances.
   */
  private static instance: None = new None();
}

export default Option;
