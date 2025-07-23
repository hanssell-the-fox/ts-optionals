import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import { isNone, isSome, None, Some } from "./option_helpers.ts";

describe("None", () => {
  it("should create an instance of Option with no value", () => {
    const value = None();
    expect(value.isNone).toBe(true);
    expect(() => value.unwrap).toThrow();
  });

  it("should return true for instanceof None and false for any other type ", () => {
    const some = Some(10);
    const none = None();
    expect(some instanceof None).toBe(false);
    expect(none instanceof None).toBe(true);
    expect({} instanceof None).toBe(false);
  });
});

describe("Some", () => {
  it("should create an instance of Option containing a value", () => {
    const value = Some(10);
    expect(value.isSome).toBe(true);
    expect(value.unwrap).toBe(10);
  });

  it("should return true for instanceof Some and false for any other type ", () => {
    const some = Some(10);
    const none = None();
    expect(some instanceof Some).toBe(true);
    expect(none instanceof Some).toBe(false);
    expect({} instanceof Some).toBe(false);
  });
});

describe("isSome", () => {
  it("should return true for Some and false for None", () => {
    const some = Some(10);
    const none = None();
    expect(isSome(some)).toBe(true);
    expect(isSome(none)).toBe(false);
  });
});

describe("isNone", () => {
  it("should return true for None and false for other values", () => {
    const some = Some(10);
    const none = None();
    expect(isNone(none)).toBe(true);
    expect(isNone(some)).toBe(false);
  });
});
