import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import type { Option } from "./option.ts";
import { isNone, isSome, None, Some } from "./option_helpers.ts";

describe("None", () => {
  it("should create an Option without value", () => {
    const none: Option<never> = None();
    expect(none.isNone).toBe(true);
    expect(() => none.unwrap()).toThrow();
  });

  it("should return true for instanceof None and false for any other type ", () => {
    const some: Option<number> = Some(10);
    const none: Option<never> = None();
    expect(some instanceof None).toBe(false);
    expect(none instanceof None).toBe(true);
    expect({} instanceof None).toBe(false);
  });
});

describe("Some", () => {
  it("should create an instance of Option containing a value", () => {
    const some: Option<number> = Some(10);
    expect(some.isSome).toBe(true);
    expect(some.unwrap()).toBe(10);
  });

  it("should return true for instanceof Some and false for any other type ", () => {
    const some: Option<number> = Some(10);
    const none: Option<never> = None();
    expect(some instanceof Some).toBe(true);
    expect(none instanceof Some).toBe(false);
    expect({} instanceof Some).toBe(false);
  });
});

describe("isSome", () => {
  it("should return true for Some and false for None", () => {
    const some: Option<number> = Some(10);
    const none: Option<never> = None();
    expect(isSome(some)).toBe(true);
    expect(isSome(none)).toBe(false);
  });
});

describe("isNone", () => {
  it("should return true for None and false for other values", () => {
    const some: Option<number> = Some(10);
    const none: Option<never> = None();
    expect(isNone(none)).toBe(true);
    expect(isNone(some)).toBe(false);
  });
});
