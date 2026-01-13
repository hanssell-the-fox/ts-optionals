import { None, type Option, Some } from "./mod.ts";
import { expect, fn } from "@std/expect";

function UNREACHABLE(): never {
  throw "UNREACHABLE";
}

Deno.test("Option.Some", async (test) => {
  const value = "value";
  const option: Option<string> = Some(value);

  await test.step('"isSome" should return true', () => {
    expect(option.isSome).toEqual(true);
  });

  await test.step('"isNone" should return false', () => {
    expect(option.isSome).toEqual(true);
  });

  await test.step('"unwrap" should return the contained value', () => {
    expect(option.unwrap()).toEqual(value);
  });

  await test.step('"unwrapOr" should return the contained value', () => {
    expect(option.unwrapOr("UNREACHABLE")).toEqual(value);
  });

  await test.step('"map" should', async (test) => {
    await test.step("call the function", () => {
      const fooFn = fn(() => "mapped") as () => string;
      option.map(fooFn);
      expect(fooFn).toHaveBeenCalled();
    });

    await test.step("pass the contained value", () => {
      const fooFn = fn(() => "mapped") as () => string;
      option.map(fooFn);
      expect(fooFn).toHaveBeenCalledWith(value);
    });

    await test.step("return Some with the result", () => {
      const newValue = "mapped";
      const mapped: Option<string> = option.map(() => newValue);
      expect(mapped.isSome).toEqual(true);
      expect(mapped.unwrap()).toEqual(newValue);
    });
  });

  await test.step('"match" should', async (test) => {
    await test.step("execute the Some handler", () => {
      const handler = fn() as () => undefined;

      option.match({
        Some: handler,
        None: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    await test.step("pass the contained value", () => {
      const handler = fn() as () => undefined;

      option.match({
        Some: handler,
        None: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalledWith(value);
    });

    await test.step("return the value from the handler", () => {
      const returnedValue = "a result value";

      const result = option.match({
        Some: () => returnedValue,
        None: UNREACHABLE,
      });

      expect(result).toEqual(returnedValue);
    });
  });
});

Deno.test("Option.None", async (test) => {
  const option: Option<string> = None;

  await test.step('"isNone" should return true', () => {
    expect(option.isNone).toEqual(true);
  });

  await test.step('"isSome" should return false', () => {
    expect(option.isSome).toEqual(false);
  });

  await test.step('"unwrap" should throw an error', () => {
    expect(() => option.unwrap()).toThrow();
  });

  await test.step('"unwrapOr" should return the default value', () => {
    const defaultValue = "default";
    expect(option.unwrapOr(defaultValue)).toEqual(defaultValue);
  });

  await test.step('"map" should', async (test) => {
    await test.step("return the current None", () => {
      const mapped = option.map(UNREACHABLE);
      expect(mapped).toEqual(option);
    });

    await test.step("not execute the function", () => {
      const mapFn = fn() as () => string;
      option.map(mapFn);
      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  await test.step('"match" should', async (test) => {
    await test.step("execute the None handler", () => {
      const handler = fn() as () => string;

      option.match({
        None: handler,
        Some: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    await test.step("return the value from the handler", () => {
      const returnedValue = "foo";

      const result = option.match({
        None: () => returnedValue,
        Some: UNREACHABLE,
      });

      expect(result).toEqual(returnedValue);
    });
  });
});
