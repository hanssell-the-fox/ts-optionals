import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import { Result } from "./result.ts";

describe("Result", () => {
  describe("Result.Ok", () => {
    it("should create an Ok result containing the provided value", () => {
      const ok: Result<number, number> = Result.Ok(10);
      expect(ok.isOk).toBe(true);
      expect(ok.unwrap).toBe(10);
    });

    it("should create an Err result if receives null or undefined", () => {
      const notNull: Result<never, Error> = Result.Ok(null);
      expect(notNull.isErr).toBe(true);
      expect(() => notNull.unwrap).toThrow();
      expect(notNull.unwrapErr).toBe('Value of type "null"');

      const notUndefined: Result<never, Error> = Result.Ok(undefined);
      expect(notUndefined.isErr).toBe(true);
      expect(() => notUndefined.unwrap).toThrow();
      expect(notUndefined.unwrapErr).toBe('Value of type "undefined"');
    });
  });

  describe("Result.Err", () => {
    it("should create an Err with the given cause", () => {
      const err: Result<number, string> = Result.Err("some error");
      expect(err.isErr).toBe(true);
      expect(err.unwrapErr).toBe("some error");
      expect(() => err.unwrap).toThrow();

      // deno-fmt-ignore
      const errInstance: Result<never, Error> = Result.Err(new Error("default error"));
      expect(errInstance.isErr).toBe(true);
      expect(errInstance.unwrapErr).toBeInstanceOf(Error);
      expect(() => errInstance.unwrap).toThrow();
    });
  });

  describe("expect", () => {
    it("should throw an error when called on an Err result", () => {
      const err = Result.Err("error");
      expect(() => err.expect("error")).toThrow();
    });

    it("should not throw an error when called on an Ok result", () => {
      const ok = Result.Ok(10);
      expect(() => ok.expect("ok")).not.toThrow();
    });
  });

  describe("flatten", () => {
    it("should recursively flatten nested Result values", () => {
      const first = Result.Ok(10);
      const second = Result.Ok(first);
      const ok = Result.Ok(second);

      const flattened = ok.flatten;
      expect(flattened).toBe(first);
      expect(flattened.unwrap).toBe(10);
    });

    it("should return same instance if the contained value is not an Result", () => {
      const ok = Result.Ok(10);
      expect(ok.flatten).toBe(ok);
      expect(ok.unwrap).toBe(10);
    });
  });

  describe("from", () => {
    it("should execute a function and capture its return type into a Result", () => {
      const ok = Result.from(() => 10);
      expect(ok).toHaveProperty("isOk");
      expect(ok.isOk).toBe(true);
    });

    it("should execute a function and capture raised errors into and Err", () => {
      const err = Result.from(() => {
        throw "some error";
      });

      expect(err).toHaveProperty("isErr");
      expect(err.isErr).toBe(true);
      expect(err.unwrapErr).toBe("some error");
    });
  });

  describe("fromAsync", () => {
    it("should execute an async function and capture its return type into a Result", async () => {
      const ok = await Result.fromAsync(async () => await Promise.resolve(10));
      expect(ok).toHaveProperty("isOk");
      expect(ok.isOk).toBe(true);
    });

    it("should execute an async function and capture raised errors into and Err", async () => {
      const err = await Result.fromAsync(async () => {
        await Promise.resolve();
        throw "some error";
      });

      expect(err).toHaveProperty("isErr");
      expect(err.isErr).toBe(true);
      expect(err.unwrapErr).toBe("some error");
    });
  });

  describe("isErr", () => {
    it("should return true when called on an Err", () => {
      const err = Result.Err("some error");
      expect(err.isErr).toBe(true);
    });

    it("should return false when called on an Ok", () => {
      const ok = Result.Ok("ok");
      expect(ok.isErr).toBe(false);
    });
  });

  describe("isOk", () => {
    it("should return true when called on an Ok", () => {
      const err = Result.Ok("ok");
      expect(err.isOk).toBe(true);
    });

    it("should return false when called on an Err", () => {
      const ok = Result.Err("some error");
      expect(ok.isOk).toBe(false);
    });
  });

  describe("map", () => {
    it("should map the value if Ok and return a new Result", () => {
      const ok = Result.Ok("hello");
      const mapped = ok.map((message) => `${message} world!`);
      expect(mapped.isOk).toBe(true);
      expect(mapped.unwrap).toBe("hello world!");
    });

    it("should not map if the value is Err", () => {
      const err = Result.Err("error");
      const mapped = err.map((err) => `${err}`);
      expect(mapped.isErr).toBe(true);
      expect(() => mapped.unwrap).toThrow();
      expect(mapped).toBe(err);
    });
  });

  describe("mapOr", () => {
    it("should map the value and return a new Result", () => {
      const ok = Result.Ok("hello");
      const mapped = ok.mapOr("seamen", (message) => `${message} world!`);
      expect(mapped.isOk).toBe(true);
      expect(mapped.unwrap).toBe("hello world!");
    });

    it("should create a Result using the fallback value", () => {
      const err = Result.Err("error");
      const mapped = err.mapOr("not an error", (err) => `${err}`);
      expect(mapped.isErr).toBe(false);
      expect(mapped.unwrap).toBe("not an error");
      expect(mapped).not.toBe(err);
    });
  });

  describe("or", () => {
    it("should return the provided Result on Err", () => {
      const err: Result<number, string> = Result.Err("some err");
      const other = err.or(Result.Ok(10));
      expect(other.isOk).toBe(true);
      expect(other.unwrap).toBe(10);
    });

    it("should return the current instance of Result on Ok", () => {
      const ok = Result.Ok(10);
      const other = ok.or(Result.Ok(20));
      expect(other.isOk).toBe(true);
      expect(other.unwrap).toBe(10);
    });
  });

  describe("peek", () => {
    it("should return the inner value without consuming the result", () => {
      const ok = Result.Ok(10);
      expect(ok.peek).toBe(10);
      expect(() => ok.unwrap).not.toThrow();
    });

    it("should return the inner value of the Ok result", () => {
      const ok = Result.Ok(10);
      expect(ok.peek).toBe(10);
      expect(() => ok.unwrap).not.toThrow();
    });

    it("should return the error cause on an Err result", () => {
      const err = Result.Err("some error");
      expect(err.peek).toBe("some error");
    });
  });

  describe("unwrap", () => {
    it("should unwrap an Ok value and consume the instance", () => {
      const ok = Result.Ok(10);
      expect(ok.unwrap).toBe(10);
      expect(ok.isErr).toBe(true);
      expect(() => ok.unwrap).toThrow();
    });

    it("should throw an error when unwrapping an Err value", () => {
      const err = Result.Err("error");
      expect(() => err.unwrap).toThrow();
    });
  });

  describe("unwrapOr", () => {
    it("should unwrap an Ok result and consume the instance", () => {
      const ok = Result.Ok(10);
      expect(ok.unwrapOr(20)).toBe(10);
      expect(() => ok.unwrap).toThrow();
    });

    it("should return the fallback value if Err", () => {
      const err = Result.Err("some error");
      expect(err.unwrapOr(20)).toBe(20);
    });
  });

  describe("unwrapOrElse", () => {
    it("should unwrap the value of an Ok and consume the result", () => {
      const ok = Result.Ok(10);
      expect(ok.unwrapOrElse(() => 20)).toBe(10);
      expect(() => ok.unwrap).toThrow();
    });

    it("should compute a fallback if Err", () => {
      const err = Result.Err("some error");
      expect(err.unwrapOrElse(() => 20)).toBe(20);
    });
  });

  describe("unwrapErr", () => {
    it("should unwrap an Err value", () => {
      const err = Result.Err("some error value");
      expect(err.unwrapErr).toBe("some error value");
    });

    it("should throw an error when called on an Ok value", () => {
      const ok = Result.Ok(10);
      expect(() => ok.unwrapErr).toThrow();
    });
  });

  describe("[Symbol.toStringTag]", () => {
    // deno-lint-ignore no-explicit-any
    const state = (result: Result<any, any>) =>
      Object.prototype.toString.call(result);

    it("should return the state of an Ok Result", () => {
      const ok = Result.Ok(10);
      expect(state(ok)).toBe("[object Result<ok<number>>]");
    });

    it("should return the state on an Err result", () => {
      const err = Result.Err("some error");
      expect(state(err)).toBe("[object Result<error<string>>]");
    });
  });
});
