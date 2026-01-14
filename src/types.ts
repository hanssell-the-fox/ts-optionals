// src/types.ts
// deno-lint-ignore-file ban-types

/**
 * Removes `null`, `undefined` and `void` from `T`, presenving the "generic" type.
 *
 * @template T The type to narrow.
 */
export type NonNullable<T> = T extends {} ? Generic<T> : never;

/**
 * Expands `T` to also expect `null` and `undefined`.
 *
 * @template T The type to expand.
 */
export type Nullable<T> = Generic<T> | null | undefined;

/**
 * Returns the "generic" type of `T`.
 *
 * @template T The type to be generalized.
 */
// deno-fmt-ignore
type Generic<T> = T extends number 
  ? number
  : T extends string 
    ? string
    : T extends boolean ? boolean
  : T;
