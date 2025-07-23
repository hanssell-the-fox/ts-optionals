import { Infer, none, NoValue, UnwrapOption } from "./_types.ts";

/**
 * Represents a value that __may__ or __may not__ be present.
 *
 * Similar to the concept of `Option` or `Maybe` found in functional programming languages.
 * Use {@linkcode Some} to wrap a value, and {@linkcode None} to represent absence of a value.
 *
 * @template T - The type of the value contained in the `Option`.
 */
export class Option<T> {
  /** Holds the value, which can be non-nulable or represent no value. */
  #value: NonNullable<T> | NoValue;

  /** @private */
  private constructor(value?: NonNullable<T> | NoValue) {
    this.#value = value ?? none;
  }

  /**
   * Creates an `Option` representing no value.
   *
   * @returns {Option<never>} An `Option` instance without a value.
   */
  public static None(): Option<never> {
    return new Option<never>(none);
  }

  /**
   * Wraps a value in an `Option`.
   *
   * If the provided value is `null` or `undefined`, it returns an `Option` representing no value.
   *
   * @template U - The type of the value to wrap.
   * @param {U} value - The value to wrap in the `Option`.
   * @returns {Option<U>} An `Option` instance containing the wrapped value or one without value.
   */
  public static Some<U>(value?: U): Option<NonNullable<U> | never> {
    return (!value || value === null || value === undefined || value === none)
      ? new Option<never>(none)
      : new Option<NonNullable<U>>(value);
  }

  /**
   * Runs a function and converts its return value into an `Option`.
   *
   * @param {() => T} fn - The function used to generate the value.
   * @returns {Option<T>} An `Option` containing the result of the function.
   */
  public static from<T>(fn: () => T): Option<T> {
    // TODO: Fix type inference
    // 2025-07-23 14:17
    return Option.Some(fn());
  }

  /**
   * Runs an _async_ function and converts its return value into an `Option`.
   *
   * @param {() => Promise<T>} fn - The function used to generate the value.
   * @returns {Promise<Option<T>>} An `Option` containing the result of the function.
   */
  public static async fromAsync<T>(fn: () => Promise<T>): Promise<Option<T>> {
    // TODO: Fix type inference
    // 2025-07-23 14:17
    return Option.Some(await fn());
  }

  /**
   * Indicates whether the `Option` contains no value.
   *
   * @returns {boolean} `true` if the value is `null`, `undefined`, or `none`; otherwise `false`
   */
  public get isNone(): boolean {
    return this.#value === none;
  }

  /**
   * Indicates whether the `Option` contains a value.
   *
   * @returns {boolean} 'true' if the value is present; otherwise `false`;
   */
  public get isSome(): boolean {
    return this.#value !== none;
  }

  /**
   * Returns the contained value or throws as error with a specified message if absent.
   *
   * @param {string} message - The error message to throw if no value is present.
   * @throws {ReferenceError} If the value is `None`.
   * @returns {T} The contained value.
   */
  public expect(message: string): T {
    if (this.isNone) throw new ReferenceError(message);
    return this.unwrap;
  }

  /**
   * Converts nested `Option<Option<T>>` into `Option<T>`.
   *
   * @returns {Option<T>} A flattened `Option` containg the value.
   */
  public flatten(): Option<UnwrapOption<T>> {
    return this.isSome && this.#value instanceof Option
      ? this.#value.flatten()
      : this as Option<UnwrapOption<T>>;
  }

  /**
   * Maps the contained value if present; otherwise, returns `None`.
   *
   * @template U - The type of the mapped value.
   * @param {(value: T) => U} fn - The function to transform the value.
   * @returns {Option<U> | this} An `Option` containing the transformed value or the current instance
   * if no value is present.
   */
  public map<U>(fn: (value: T) => U): this | Option<Infer<U>> {
    return this.isSome
      ? Option.Some(fn(this.#value as T)) as Option<Infer<U>>
      : this;
  }

  /**
   * Maps the contained value if present, or returns a default value.
   *
   * @template U - The type of the default value.
   * @param {U} value - The default value to return if no value is present.
   * @param {(value: T) => U} fn - The function to transform the value if present.
   * @returns {Option<U>} An `Option` containing the mapped value or the default value.
   */
  public mapOr<U>(value: U, fn: (value: T) => U): Option<Infer<U>> {
    const mappedValue = this.isSome ? this.map(fn).peek : value;
    return Option.Some(mappedValue) as Option<Infer<U>>;
  }

  /**
   * Returns this `Option` if it contains a value; otherwise, returns another `Option`.
   *
   * @param {Option<T>} other - The fallback `Option` to return if this one is empty.
   * @returns {Option<T>} This `Option` if it contains a value; otherwise, the fallback `Option`.
   */
  public or(other: Option<T>): Option<T> {
    return this.isSome ? this : other;
  }

  /**
   * Exposes the internal value (even if `None`) in a readonly form.
   *
   * This is intended for introspection or unsafe access.
   *
   * @returns {Readonly<T>} The internal value.
   */
  public get peek(): Readonly<T> {
    return this.#value as T;
  }

  /**
   * Returns the contained value or throws an error if absent.
   *
   * @throws {ReferenceError} If the value is `None`.
   * @returns {NonNullable<T>} The contained value.
   */
  public get unwrap(): NonNullable<T> | never {
    if (this.isNone) throw new ReferenceError("Unwrap called on a None value");
    const value = this.#value as NonNullable<T>;
    this.#value = none;
    return value;
  }

  /**
   * Returns the contained value or a fallback value if absent.
   *
   * @param {U} thisValue - The fallback value to return if no value is present.
   * @returns {T | U} The contained value or the fallback value.
   */
  public unwrapOr<U>(thisValue: U): T | Infer<U> {
    return this.isSome ? this.unwrap : thisValue as Infer<U>;
  }

  /**
   * Returns the contained value or computes one from a function if absent.
   *
   * @param {() => U} doThis - The function to compute the fallback value.
   * @returns {T | U} The contained value or the computed fallback value.
   */
  public unwrapOrElse<U>(doThis: () => U): T | Infer<U> {
    return this.isSome ? this.unwrap : doThis() as Infer<U>;
  }

  /**
   * Provides a human-readable tag for `Object.prototype.toString.call`.
   *
   * @returns {string} A string representation of the `Option` state.
   */
  public get [Symbol.toStringTag](): string {
    return this.isNone
      ? "none"
      : Array.isArray(this.#value)
      ? `array<${typeof this.#value[0]}>`
      : typeof this.#value;
  }
}
