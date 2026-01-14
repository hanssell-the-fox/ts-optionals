// utils/is-nullable_test.ts

import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { isNullable } from "./is-nullable.ts";

describe('"isNullable" utility function', () => {
  it("should return true if the value is nullable", () => {
    for (const value of [null, undefined]) {
      expect(isNullable(value)).toEqual(true);
    }
  });

  it("should return false if the value is not nullable", () => {
    for (const value of [false, "foo", 123]) {
      expect(isNullable(value)).toEqual(false);
    }
  });
});
