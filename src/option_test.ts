import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Option } from "./option.ts";
import { none } from "./_types.ts";

describe("Option", () => {
  describe("Option.Some", () => {
    it("should return Some when given a valid (non-null, non-undefined) value", () => {
      const someValue = Option.Some(12);
      expect(someValue.isSome).toBe(true);
      expect(someValue.unwrap).toBe(12);
    });

    it("should return None when given a null or undefined", () => {
      const nullSome = Option.Some(null);
      expect(nullSome.isNone).toBe(true);
      expect(nullSome.peek).toBe(none);
      expect(() => nullSome.unwrap).toThrow();

      const undefinedSome = Option.Some(undefined);
      expect(undefinedSome.isNone).toBe(true);
      expect(undefinedSome.peek).toBe(none);
      expect(() => undefinedSome.unwrap).toThrow();
    });
  });

  describe("Option.None", () => {
    it("should create a None instance consistently", () => {
      const noneValue = Option.None();
      expect(noneValue.isNone).toBe(true);
      expect(noneValue.peek).toBe(none);
      expect(() => noneValue.unwrap).toThrow();
    });
  });

  describe("from", () => {
    it("should wrap the return value of function in Some if not null/undefined", () => {
      const someValue = Option.from(() => 10);
      expect(someValue.isSome).toBe(true);
      expect(someValue.unwrap).toBe(10);
    });

    it("should return None if the function returns null or undefined", () => {
      const noneValue = Option.from(() => null);
      expect(noneValue.isNone).toBe(true);
      expect(noneValue.peek).toBe(none);
      expect(() => noneValue.unwrap).toThrow();
    });
  });

  describe("fromAsync", () => {
    it("should wrap async result in Some if not null/undefined", async () => {
      const someValue = await Option.fromAsync(async () =>
        await Promise.resolve(10)
      );

      expect(someValue.isSome).toBe(true);
      expect(someValue.unwrap).toBe(10);
    });

    it("should return None if async result is null or undefined", async () => {
      const noneValue = await Option.fromAsync(async () =>
        await Promise.resolve(null)
      );

      expect(noneValue.isNone).toBe(true);
      expect(() => noneValue.unwrap).toThrow();
    });
  });

  describe("isSome", () => {
    it("shoudl return true when called on a Some value", () => {
      const someValue = Option.Some(12);
      expect(someValue.isSome).toBe(true);
    });

    it("should return false when called in a None value", () => {
      const noneValue = Option.None();
      expect(noneValue.isSome).toBe(false);
    });
  });

  describe("isNone", () => {
    it("should return true when called on a None value", () => {
      const someValue = Option.None();
      expect(someValue.isNone).toBe(true);
    });

    it("should return false when called in a Some value", () => {
      const noneValue = Option.Some(10);
      expect(noneValue.isNone).toBe(false);
    });
  });

  describe("expect", () => {
    it("should not throw an error when called on a Some value", () => {
      const someValue = Option.Some(10);
      expect(() => someValue.expect("some")).not.toThrow();
    });

    it("should throw an error when called on a None value", () => {
      const noneValue = Option.None();
      expect(() => noneValue.expect("none")).toThrow();
    });
  });

  describe("unwrap", () => {
    it("should unwrap value and throw on second unwrap (invalidates after the fisrt access)", () => {
      const someValue = Option.Some(10);
      const unwrappedValue = someValue.unwrap;
      expect(unwrappedValue).toBe(10);

      const invalidatedSome = Option.Some(12);
      expect(() => invalidatedSome.unwrap).not.toThrow();
      expect(() => invalidatedSome.unwrap).toThrow();
    });

    it("should throw an error when unwrapping a None value", () => {
      const noneValue = Option.None();
      expect(() => noneValue.unwrap).toThrow();
    });
  });

  describe("unwrapOr", () => {
    it("should unwrap value if Some, or fallback if None", () => {
      const someValue = Option.Some(12);
      expect(someValue.unwrapOr(30)).toBe(12);

      const noneValue = Option.None();
      expect(noneValue.unwrapOr(30)).toBe(30);
    });
  });

  describe("unwrapOrElse", () => {
    it("should unwrap value if Some, or compute a fallback if None", () => {
      const someValue = Option.Some(10);
      expect(someValue.unwrapOrElse(() => 100)).toBe(10);

      const noneValue = Option.None();
      expect(noneValue.unwrapOrElse(() => 100)).toBe(100);
    });
  });

  describe("map", () => {
    it("should map the value if Some and return a new Option", () => {
      const someValue = Option.Some(10);
      const mappedValue = someValue.map((value) => value + 1);
      expect(mappedValue.unwrap).toBe(11);
    });

    it("should not map if the value is None", () => {
      const noneValue = Option.None();
      const noneMapped = noneValue.map((_value) => 10);
      expect(() => noneMapped.unwrap).toThrow();
    });
  });

  describe("mapOr", () => {
    it("should map the value and return a new Option", () => {
      const someValue = Option.Some(10);
      const someMapped = someValue.mapOr(100, (value) => value + 10);
      expect(someMapped.isSome).toBe(true);
      expect(someMapped.unwrap).toBe(20);
    });

    it("should create an Option using the fallback", () => {
      const noneValue = Option.None();
      const noneMapped = noneValue.mapOr(10, (value) => value);
      expect(noneMapped.isSome).toBe(true);
      expect(noneMapped.unwrap).toBe(10);
    });
  });

  describe("flatten", () => {
    it("should recursively flatten nested Option values", () => {
      const first = Option.Some("ok");
      const second = Option.Some(first);
      const nested = Option.Some(second);

      const flattened = nested.flatten();
      expect(flattened).not.toBe(nested);
      expect(flattened.unwrap).toBe("ok");
    });

    it("should return same instance if value is not an Option", () => {
      const noFlatten = Option.Some(10);
      const flattened = noFlatten.flatten();
      expect(flattened).toBe(noFlatten);
    });
  });

  describe("peek", () => {
    it("should return inner value without invalidating the instance", () => {
      const someValue = Option.Some(10);
      expect(someValue.peek).toBe(10);
      expect(someValue.isSome).toBe(true);

      const noneValue = Option.None();
      expect(noneValue.peek).toBe(none);
      expect(noneValue.isNone).toBe(true);
    });
  });

  describe("or", () => {
    it("should return fallback Option if original was invalidated (None)", () => {
      const someValue = Option.Some(10);
      someValue.unwrap; // Invalidates the Option

      const otherValue = Option.Some(20);
      expect(someValue.or(otherValue)).toBe(otherValue);
    });
  });
});
