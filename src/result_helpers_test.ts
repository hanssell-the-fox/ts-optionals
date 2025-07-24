import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import { Err, isErr, isOk, Ok } from "./result_helpers.ts";

describe("Ok", () => {
  it("should create an Ok result containing a value", () => {
    const value = Ok(10);
    expect(value.isOk).toBe(true);
    expect(value instanceof Ok).toBe(true);
    expect(value.unwrap).toBe(10);
  });

  it("should create and Err result when receives null/undefined", () => {
    const value = Ok(null);
    expect(value.isOk).toBe(false);
    expect(() => value.unwrap).toThrow();
  });

  it("should return true for instanceof Ok and false for any other type ", () => {
    const some = Ok(10);
    expect(some instanceof Ok).toBe(true);
    expect({} instanceof Ok).toBe(false);

    some.unwrap; // Consumes the instance
    expect(some instanceof Ok).toBe(false);
  });
});

describe("Err", () => {
  it("should create an Err containing a cause", () => {
    const err = Err("some error");
    expect(err.isErr).toBe(true);
    expect(err.unwrapErr).toBe("some error");
  });

  it("should return true for instanceof Err and false for any other type ", () => {
    const err = Err("some error");
    expect(err instanceof Err).toBe(true);
    expect({} instanceof Err).toBe(false);
  });
});

describe("isOk", () => {
  it("should return true for an Ok result", () => {
    expect(isOk(Ok(10))).toBe(true);
  });

  it("should result false for any other type", () => {
    expect(isOk(Err("not ok"))).toBe(false);
    expect(isOk(1)).toBe(false);
    expect(isOk([])).toBe(false);
  });
});

describe("isNone", () => {
  it("should return true for an Err result", () => {
    expect(isErr(Err("thats an error"))).toBe(true);
  });

  it("should result false for any other type", () => {
    expect(isErr(Ok("not ok"))).toBe(false);
    expect(isErr(1)).toBe(false);
    expect(isErr([])).toBe(false);
  });
});
