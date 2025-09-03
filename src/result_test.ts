import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import { Result } from "./result.ts";

describe("Result", () => {
  describe("Result.Ok", () => {
    it("should create an Ok result containing the provided value", () => {
      const ok: Result<number, never> = Result.Ok(10);
      expect(ok.isOk).toBe(true);
      expect(ok.unwrap()).toBe(10);

      const nullButOk: Result<null, never> = Result.Ok(null);
      expect(nullButOk.isOk).toBe(true);
      expect(nullButOk.unwrap()).toBe(null);
    });
  });

  describe("Result.Err", () => {
    it("should create an Err with the given cause", () => {
      const err: Result<never, string> = Result.Err("some error");
      expect(err.isErr).toBe(true);
      expect(err.unwrapErr()).toBe("some error");
      expect(() => err.unwrap()).toThrow(ReferenceError);

      // deno-fmt-ignore
      const errInstance: Result<never, Error> = Result.Err(new Error("default error"));
      expect(errInstance.isErr).toBe(true);
      expect(errInstance.unwrapErr()).toBeInstanceOf(Error);
      expect(() => errInstance.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("expect", () => {
    it("should throw an error when called on an Err result", () => {
      const err: Result<never, string> = Result.Err("error");
      expect(() => err.expect("error")).toThrow(ReferenceError);
    });

    it("should not throw an error when called on an Ok result", () => {
      const ok: Result<number, never> = Result.Ok(10);
      expect(() => ok.expect("ok")).not.toThrow();
    });
  });

  describe("from", () => {
    it("should execute a function and capture its return into a Result", () => {
      const ok: Result<number, never> = Result.from(() => 10);
      expect(ok.isOk).toBe(true);
    });

    it("should execute a function and capture raised errors into an Err", () => {
      const err: Result<never, string> = Result.from(() => {
        throw "some error";
      });

      expect(err.isErr).toBe(true);
      expect(err.unwrapErr()).toBe("some error");
    });
  });

  describe("fromAsync", () => {
    it("should execute an async function and capture its return into a Result", async () => {
      const ok: Result<number, never> = await Result.fromAsync(async () =>
        await Promise.resolve(10)
      );
      expect(ok.isOk).toBe(true);
    });

    it("should execute an async function and capture raised errors into an Err", async () => {
      const err: Result<never, string> = await Result.fromAsync(() => {
        throw "some error";
      });

      expect(err.isErr).toBe(true);
      expect(err.unwrapErr()).toBe("some error");
    });
  });

  describe("isErr", () => {
    it("should return true when called on an Err", () => {
      const err: Result<never, string> = Result.Err("some error");
      expect(err.isErr).toBe(true);
    });

    it("should return false when called on an Ok", () => {
      const ok: Result<string, never> = Result.Ok("ok");
      expect(ok.isErr).toBe(false);
    });
  });

  describe("isOk", () => {
    it("should return true when called on an Ok", () => {
      const err: Result<string, never> = Result.Ok("ok");
      expect(err.isOk).toBe(true);
    });

    it("should return false when called on an Err", () => {
      const ok: Result<never, string> = Result.Err("some error");
      expect(ok.isOk).toBe(false);
    });
  });

  describe("map", () => {
    it("should map the value if Ok and return a new Result", () => {
      const ok: Result<string, never> = Result.Ok("hello");
      const mapped: Result<string, never> = ok.map((message) => `${message} world!`);
      expect(mapped.isOk).toBe(true);
      expect(mapped.unwrap()).toBe("hello world!");
    });

    it("should not map if the value is Err", () => {
      const err: Result<never, string> = Result.Err("error");
      const mapped: Result<string, string> = err.map((err) => `${err}`);
      expect(mapped.isErr).toBe(true);
      expect(mapped).toBe(err);
      expect(() => mapped.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("or", () => {
    it("should return the provided Result on Err", () => {
      const err: Result<number, string> = Result.Err("some err");
      const other: Result<number, string> = err.or(Result.Ok(10));
      expect(other.isOk).toBe(true);
      expect(other.unwrap()).toBe(10);
    });

    it("should return the current instance of Result on Ok", () => {
      const ok: Result<number, never> = Result.Ok(10);
      const other: Result<number, never> = ok.or(Result.Ok(20));
      expect(other.isOk).toBe(true);
      expect(other.unwrap()).toBe(10);
    });
  });

  describe("unwrap", () => {
    it("should unwrap an Ok value and consume the instance", () => {
      const ok: Result<number, never> = Result.Ok(10);
      expect(ok.unwrap()).toBe(10);
      expect(() => ok.unwrap()).toThrow(ReferenceError);
    });

    it("should throw an error when unwrapping an Err value", () => {
      const err: Result<never, string> = Result.Err("error");
      expect(() => err.unwrap()).toThrow(ReferenceError);
    });
  });

  describe("unwrapErr", () => {
    it("should unwrap an Err value", () => {
      const err: Result<never, string> = Result.Err("some error value");
      expect(err.unwrapErr()).toBe("some error value");
    });

    it("should throw an error when called on an Ok value", () => {
      const ok: Result<number, never> = Result.Ok(10);
      expect(() => ok.unwrapErr()).toThrow(ReferenceError);
    });
  });
});
