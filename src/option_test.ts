import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Option } from "./option.ts";

describe("Option", () => {
  describe("Option.Some", () => {
    it("should create an Option containing the provided value", () => {
      const value: Option<number> = Option.Some(10);
      expect(value.isSome).toBe(true);
      expect(value.unwrap()).toBe(10);
    });

    it("should create an Option without value when given null or undefined", () => {
      const nullOption: Option<never> = Option.Some(null);
      expect(nullOption.isNone).toBe(true);
      expect(() => nullOption.unwrap()).toThrow(ReferenceError);

      const undefinedOption: Option<never> = Option.Some(undefined);
      expect(undefinedOption.isNone).toBe(true);
      expect(() => undefinedOption.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("Option.None", () => {
    it("should create an Option without value", () => {
      const none: Option<never> = Option.None();
      expect(none.isNone).toBe(true);
      expect(() => none.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("from", () => {
    it("should wrap the return value of the function into an Option", () => {
      const some: Option<number> = Option.from(() => 10);
      expect(some.isSome).toBe(true);
      expect(some.unwrap()).toBe(10);
    });

    it("should return an Option without value if the function returns null, undefined or throws an Exception", () => {
      const nullValueOption: Option<never> = Option.from(() => null);
      expect(nullValueOption.isNone).toBe(true);
      expect(() => nullValueOption.unwrap()).toThrow(ReferenceError);

      const undefinedValueOption: Option<never> = Option.from(() => undefined);
      expect(undefinedValueOption.isNone).toBe(true);
      expect(() => undefinedValueOption.unwrap()).toThrow(ReferenceError);

      // deno-fmt-ignore
      const throwsAnErrorOption: Option<never> = Option.from(() => { throw "Some error" });
      expect(throwsAnErrorOption.isNone).toBe(true);
      expect(() => throwsAnErrorOption.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("fromAsync", () => {
    it("should wrap the return value of the asynchronous function into an Option", async () => {
      const some: Option<number> = await Option.fromAsync(async () => await Promise.resolve(10));
      expect(some.isSome).toBe(true);
      expect(some.unwrap()).toBe(10);
    });

    it("should return an Option without value if the asynchronous function returns null, undefined or throws an Exception", async () => {
      const nullValueOption: Option<never> = await Option.fromAsync(async () =>
        await Promise.resolve(null)
      );
      expect(nullValueOption.isNone).toBe(true);
      expect(() => nullValueOption.unwrap()).toThrow(ReferenceError);

      const undefinedValueOption: Option<never> = await Option.fromAsync(async () =>
        await Promise.resolve(undefined)
      );
      expect(undefinedValueOption.isNone).toBe(true);
      expect(() => undefinedValueOption.unwrap()).toThrow(ReferenceError);

      // deno-fmt-ignore
      const errorOption: Option<never> = await Option.fromAsync(() => { throw "Some error" });
      expect(errorOption.isNone).toBe(true);
      expect(() => errorOption.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("isSome", () => {
    it("shoudl return true when the Option contains a value", () => {
      const some: Option<number> = Option.Some(12);
      expect(some.isSome).toBe(true);
    });

    it("should return false if the Option does not contains a value", () => {
      const none: Option<never> = Option.None();
      expect(none.isSome).toBe(false);
    });
  });

  describe("isNone", () => {
    it("should return true is the Option does not contains a value", () => {
      const none: Option<never> = Option.None();
      expect(none.isNone).toBe(true);
    });

    it("should return false when the Option contains a value", () => {
      const some: Option<number> = Option.Some(10);
      expect(some.isNone).toBe(false);
    });
  });

  describe("expect", () => {
    it("should return the value contained by the Option", () => {
      const some: Option<number> = Option.Some(10);
      expect(some.expect("Expected the value 10")).toBe(10);
    });

    it("should return the value contained by the Option and consumes the instance", () => {
      const some: Option<number> = Option.Some(10);
      expect(some.expect("Expected the value 10")).toBe(10);
      expect(() => some.expect("There is no value anymore")).toThrow(ReferenceError);
    });

    it("should throw an error if the Option does not contain a value", () => {
      const none: Option<never> = Option.None();

      try {
        none.expect("There is no value in the Option");
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
        expect((error as ReferenceError).message).toEqual("There is no value in the Option");
      }
    });
  });

  describe("unwrap", () => {
    it("should return the value contained by the Option", () => {
      const some: Option<number> = Option.Some(10);
      expect(some.unwrap()).toBe(10);
    });

    it("should return the value contained by the Option and consumes the instance", () => {
      const some: Option<number> = Option.Some(10);
      expect(some.unwrap()).toBe(10);
      expect(() => some.unwrap()).toThrow(ReferenceError);
    });

    it("should throw an error if the Option does not contain a value", () => {
      const none: Option<never> = Option.None();

      try {
        none.unwrap();
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
        expect((error as ReferenceError).message).toEqual("Unwrap called on a None value");
      }
    });
  });

  describe("map", () => {
    it("should create a new Option with the result of the provided function", () => {
      const some: Option<string> = Option.Some("Hello");
      const mapped: Option<string> = some.map((value) => value + " world!");
      expect(mapped.unwrap()).toBe("Hello world!");
    });

    it("should not create a new Option if the current one does not contain a value", () => {
      const none: Option<never> = Option.None();
      const mapped: Option<number> = none.map((_) => 10);
      expect(() => mapped.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("or", () => {
    it("should return the current Option instance if it contains a value", () => {
      const some: Option<number> = Option.Some(10);
      const other: Option<number> = Option.Some(20);
      expect(some.or(other)).toBe(some);
      expect(some.or(other).unwrap()).toBe(10);
    });

    it("should return the provided fallback Option if the current instance does not contain a value", () => {
      const none: Option<number> = Option.None();
      const some: Option<number> = Option.Some(10);
      expect(none.or(some)).toBe(some);
      expect(none.or(some).unwrap()).toBe(10);
    });
  });
});
