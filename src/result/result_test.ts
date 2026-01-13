// result/result_test.ts

import { Option } from "../option/mod.ts";
import { Err, Ok, type Result } from "./mod.ts";
import { expect, fn } from "@std/expect";

function UNREACHABLE(): never {
  throw "UNREACHABLE";
}

Deno.test("Result.Ok", async (test) => {
  const value = "value";
  const result: Result<string, string> = Ok(value);

  await test.step('"isOk" should return true', () => {
    expect(result.isOk).toEqual(true);
  });

  await test.step('"isErr" should return false', () => {
    expect(result.isErr).toEqual(false);
  });

  await test.step('"unwrap" should returns the success value', () => {
    expect(result.unwrap()).toEqual(value);
  });

  await test.step('"unwrapOr" should return the success value', () => {
    expect(result.unwrapOr("UNREACHABLE")).toEqual(value);
  });

  await test.step('"unwrapErr" should throw an error', () => {
    expect(() => result.unwrapErr()).toThrow();
  });

  await test.step('"ok" should return the Ok value as Some (Option)', () => {
    expect(result.ok instanceof Option).toEqual(true);
    expect(result.ok.isSome).toEqual(true);
    expect(result.ok.unwrap()).toEqual(value);
  });

  await test.step('"error" should return the Err value as None (Option)', () => {
    expect(result.error instanceof Option).toEqual(true);
    expect(result.error.isNone).toEqual(true);
  });

  await test.step('"map" should', async (test) => {
    await test.step("call the function", () => {
      const mapFn = fn() as () => string;
      result.map(mapFn);
      expect(mapFn).toHaveBeenCalled();
    });

    await test.step("pass the success value", () => {
      const mapFn = fn() as () => string;
      result.map(mapFn);
      expect(mapFn).toHaveBeenCalledWith(value);
    });

    await test.step("return an Ok with the result", () => {
      const newValue = "mapped";
      const mapped: Result<string, string> = result.map(() => newValue);
      expect(mapped.isOk).toEqual(true);
      expect(mapped.unwrap()).toEqual(newValue);
    });
  });

  await test.step('"mapErr" should', async (test) => {
    await test.step("return the current Ok", () => {
      const mapped: Result<string, string> = result.mapErr(UNREACHABLE);
      expect(mapped).toEqual(result);
    });

    await test.step("not execute the function", () => {
      const mapFn = fn() as () => string;
      result.mapErr(mapFn);
      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  await test.step('"match" should', async (test) => {
    await test.step("execute the Ok handler", () => {
      const handler = fn(() => undefined) as () => undefined;

      result.match({
        Ok: handler,
        Err: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    await test.step("pass the success value", () => {
      const handler = fn(() => undefined) as () => undefined;

      result.match({
        Ok: handler,
        Err: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalledWith(value);
    });

    await test.step("returns the result of the handler", () => {
      const returnedValue = "a value";

      const returned = result.match({
        Ok: () => returnedValue,
        Err: UNREACHABLE,
      });

      expect(returned).toEqual(returnedValue);
    });
  });
});

Deno.test("Result.Err", async (test) => {
  const value = "value";
  const result: Result<string, string> = Err(value);

  await test.step('"isOk" should return false', () => {
    expect(result.isOk).toEqual(false);
  });

  await test.step('"isErr" should return true', () => {
    expect(result.isErr).toEqual(true);
  });

  await test.step('"unwrap" should throw an error', () => {
    expect(() => result.unwrap()).toThrow();
  });

  await test.step('"unwrapOr" should return the default value', () => {
    const defaultValue = "default";
    expect(result.unwrapOr(defaultValue)).toEqual(defaultValue);
  });

  await test.step('"unwrapErr" should return the error value', () => {
    expect(result.unwrapErr()).toEqual(value);
  });

  await test.step('"ok" should return None (Option)', () => {
    expect(result.ok instanceof Option).toEqual(true);
    expect(result.ok.isNone).toEqual(true);
  });

  await test.step('"error" should return the error value as Some (Option)', () => {
    expect(result.error instanceof Option).toEqual(true);
    expect(result.error.isSome).toEqual(true);
    expect(result.error.unwrap()).toEqual(value);
  });

  await test.step('"map" should', async (test) => {
    await test.step("return the current Err", () => {
      const mapped: Result<string, string> = result.map(UNREACHABLE);
      expect(mapped).toEqual(result);
    });

    await test.step("not execute the function", () => {
      const mapFn = fn() as () => string;
      result.map(mapFn);
      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  await test.step('"mapErr" should', async (test) => {
    await test.step("call the function", () => {
      const mapFn = fn() as () => string;
      result.mapErr(mapFn);
      expect(mapFn).toHaveBeenCalled();
    });

    await test.step("pass the error value", () => {
      const mapFn = fn() as () => string;
      result.mapErr(mapFn);
      expect(mapFn).toHaveBeenCalledWith(value);
    });

    await test.step("return an Err with the result", () => {
      const newValue = "mapped";
      const mapped: Result<string, string> = result.mapErr(() => newValue);
      expect(mapped.isErr).toEqual(true);
      expect(mapped.unwrapErr()).toEqual(newValue);
    });
  });

  await test.step('"match" should', async (test) => {
    await test.step("execute the Err handler", () => {
      const handler = fn(() => undefined) as () => undefined;

      result.match({
        Err: handler,
        Ok: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    await test.step("passes the error value", () => {
      const handler = fn(() => undefined) as () => undefined;

      result.match({
        Err: handler,
        Ok: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalledWith(value);
    });

    await test.step("returns the result of the handler", () => {
      const returnedValue = "a value";

      const returned = result.match({
        Err: () => returnedValue,
        Ok: UNREACHABLE,
      });

      expect(returned).toEqual(returnedValue);
    });
  });
});
