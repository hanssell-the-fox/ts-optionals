import { Option } from "./option.ts";

/**
 * Symbol for representing the primitive `none` value.
 */
export const none: unique symbol = Symbol("none");

/**
 * Fancy way to tell that the `Option` does not have a value.
 */
export type NoValue = typeof none;

/**
 * Extracts the original type of nested `Option` values.
 */
export type UnwrapOption<T> = T extends Option<infer S> ? UnwrapOption<S> : T;

/**
 * Helps with type inference for primitives.
 */
export type Infer<Type> = Type extends string ? string
  : Type extends number ? number
  : Type extends boolean ? boolean
  : Type extends bigint ? bigint
  : Type extends symbol ? symbol
  : Type;
