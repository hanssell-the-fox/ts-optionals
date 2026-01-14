// option/option_test.ts

import { expect, fn } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { None, Option, Some } from "./mod.ts";

describe('"Option.Some" static factory', () => {
  it("should create a Some variant Option containing the provided value", () => {
    const value = "value";
    const option: Option<string> = Option.Some(value);
    expect(option.isSome).toEqual(true);
    expect(option.unwrap()).toEqual(value);
  });

  it("should throw an error if the value is nullable", () => {
    expect(() => Option.Some(null as unknown as string)).toThrow();
  });
});

describe('"Option.None" static factory', () => {
  it("should create a None variant of Option", () => {
    const option: Option<unknown> = Option.None();
    expect(option instanceof Option).toEqual(true);
    expect(option.isNone).toEqual(true);
  });
});

describe('"Option.from" static factory', () => {
  it("should create a Some variant of Option containing the provided value", () => {
    const value = "value";
    const option: Option<unknown> = Option.from(value);
    expect(option instanceof Option).toEqual(true);
    expect(option.isSome).toEqual(true);
    expect(option.unwrap()).toEqual(value);
  });

  it("should create a None variant of Option if the value is nullable", () => {
    const option: Option<unknown> = Option.from(null);
    expect(option instanceof Option).toEqual(true);
    expect(option.isNone).toEqual(true);
  });
});

describe("Some variant of Option", () => {
  const value = "value";
  const option: Option<string> = Some(value);

  describe('"isSome" should return true', () => {
    expect(option.isSome).toEqual(true);
  });

  describe('"isNone" should return false', () => {
    expect(option.isSome).toEqual(true);
  });

  describe('"unwrap" should return the contained value', () => {
    const returned: unknown = option.unwrap();
    expect(returned).toEqual(value);
  });

  describe('"unwrapOr" should return the contained value', () => {
    const returned: unknown = option.unwrapOr("UNREACHABLE");
    expect(returned).toEqual(value);
  });

  describe('"map"', () => {
    it("should call the function with the contained value", () => {
      const mapFn = fn(() => "foo") as () => string;
      option.map(mapFn);
      expect(mapFn).toHaveBeenCalled();
      expect(mapFn).toHaveBeenCalledWith(value);
    });

    it("should return a new Some containing the result of the function", () => {
      const newValue = "mapped";
      const result: Option<string> = option.map(() => newValue);
      expect(result instanceof Option).toEqual(true);
      expect(result.isSome).toEqual(true);
      expect(result.unwrap()).toEqual(newValue);
    });

    it("should throw an error if the function result is nullable", () => {
      const mapFn = fn(() => null) as () => string;
      expect(() => option.map(mapFn)).toThrow();
    });
  });

  describe('"match"', () => {
    it("should execute the Some handler with the contained value", () => {
      const handler = fn() as () => undefined;

      option.match({
        Some: handler,
        None: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledWith(value);
    });

    it("should return the result of the handler", () => {
      const returned = "result";

      const result = option.match({
        Some: () => returned,
        None: UNREACHABLE,
      });

      expect(result).toEqual(returned);
    });
  });
});

describe("None variant of Option", () => {
  const option: Option<string> = None;

  describe('"isSome" should return false', () => {
    expect(option.isSome).toEqual(false);
  });

  describe('"isNone" should return true', () => {
    expect(option.isNone).toEqual(true);
  });

  describe('"unwrap" should throw an error', () => {
    expect(() => option.unwrap()).toThrow();
  });

  describe('"unwrapOr" should return the default value', () => {
    const defaultValue = "default";
    const returned: unknown = option.unwrapOr(defaultValue);
    expect(returned).toEqual(defaultValue);
  });

  describe('"map"', () => {
    it("should not execute the function", () => {
      const mapFn = fn(() => "foo") as () => string;
      option.map(mapFn);
      expect(mapFn).not.toHaveBeenCalled();
    });

    it("should return the current instance of None", () => {
      const mapped: unknown = option.map(UNREACHABLE);
      expect(mapped).toEqual(option);
    });
  });

  describe('"match"', () => {
    it("should execute the None handler", () => {
      const handler = fn() as () => string;

      option.match({
        None: handler,
        Some: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    it("should return the result of the handler", () => {
      const returned = "foo";

      const result = option.match({
        None: () => returned,
        Some: UNREACHABLE,
      });

      expect(result).toEqual(returned);
    });
  });
});

function UNREACHABLE(): never {
  throw "UNREACHABLE";
}
