import { Option } from "@hans/ts-optionals";
import { type Either, Left, Right } from "./mod.ts";
import { expect, fn } from "@std/expect";

function UNREACHABLE(): never {
  throw "UNREACHABLE";
}

Deno.test("Either.Left", async (test) => {
  const value = "value";
  const either: Either<string, string> = Left(value);

  await test.step('"isLeft" should return true', () => {
    expect(either.isLeft).toEqual(true);
  });

  await test.step('"isRight" should return false', () => {
    expect(either.isRight).toEqual(false);
  });

  await test.step('"unwrapLeft" should return the contained value', () => {
    expect(either.unwrapLeft()).toEqual(value);
  });

  await test.step('"unwrapRight" should throw an error', () => {
    expect(() => either.unwrapRight()).toThrow();
  });

  await test.step('"left should return the Left value as Some (Option)"', () => {
    expect(either.left instanceof Option).toEqual(true);
    expect(either.left.isSome).toEqual(true);
    expect(either.left.unwrap()).toEqual(value);
  });

  await test.step('"right should return the Right value as None (Option)"', () => {
    expect(either.right instanceof Option).toEqual(true);
    expect(either.right.isNone).toEqual(true);
  });

  await test.step('"mapLeft" should', async (test) => {
    await test.step("call the function", () => {
      const mapFn = fn() as () => string;
      either.mapLeft(mapFn);
      expect(mapFn).toHaveBeenCalled();
    });

    await test.step("pass the left value", () => {
      const mapFn = fn() as () => string;
      either.mapLeft(mapFn);
      expect(mapFn).toHaveBeenCalledWith(value);
    });

    await test.step("return a Left with the result", () => {
      const newValue = "mapped";
      const mapped: Either<string, string> = either.mapLeft(() => newValue);
      expect(mapped.isLeft).toEqual(true);
      expect(mapped.unwrapLeft()).toEqual(newValue);
    });
  });

  await test.step('"mapRight should"', async (test) => {
    await test.step("return the current Left", () => {
      expect(either.mapRight(UNREACHABLE)).toEqual(either);
    });

    await test.step("not execute the function", () => {
      const mapFn = fn() as () => string;
      either.mapRight(mapFn);
      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  await test.step('"match" should', async (test) => {
    await test.step("execute the Left handler", () => {
      const handler = fn() as () => undefined;

      either.match({
        Left: handler,
        Right: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    await test.step("pass the contained value to the handler", () => {
      const handler = fn() as () => undefined;

      either.match({
        Left: handler,
        Right: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalledWith(value);
    });

    await test.step("return the randler result", () => {
      const handlerReturn = "a value";

      const value = either.match({
        Left: () => handlerReturn,
        Right: UNREACHABLE,
      });

      expect(value).toEqual(handlerReturn);
    });
  });
});

Deno.test("Either.Right", async (test) => {
  const value = "value";
  const either: Either<string, string> = Right(value);

  await test.step('"isLeft" should return false', () => {
    expect(either.isLeft).toEqual(false);
  });

  await test.step('"isRight" should return true', () => {
    expect(either.isRight).toEqual(true);
  });

  await test.step('"unwrapLeft" should throw an error', () => {
    expect(() => either.unwrapLeft()).toThrow();
  });

  await test.step('"unwrapRight" should return the contained value', () => {
    expect(either.unwrapRight()).toEqual(value);
  });

  await test.step('"left" should return Left as None (Option)', () => {
    expect(either.left instanceof Option).toEqual(true);
    expect(either.left.isNone).toEqual(true);
  });

  await test.step('"right" should return Right as Some (Option)', () => {
    expect(either.right instanceof Option).toEqual(true);
    expect(either.right.isSome).toEqual(true);
    expect(either.right.unwrap()).toEqual(value);
  });

  await test.step('"mapLeft" should"', async (test) => {
    await test.step("return the current Right", () => {
      expect(either.mapLeft(UNREACHABLE)).toEqual(either);
    });

    await test.step("not execute the function", () => {
      const mapFn = fn() as () => string;
      either.mapLeft(mapFn);
      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  await test.step('"mapRight" should', async (test) => {
    await test.step("call the function", () => {
      const mapFn = fn() as () => string;
      either.mapRight(mapFn);
      expect(mapFn).toHaveBeenCalled();
    });

    await test.step("pass the right value", () => {
      const mapFn = fn() as () => string;
      either.mapRight(mapFn);
      expect(mapFn).toHaveBeenCalledWith(value);
    });

    await test.step("return a Right with the result", () => {
      const newValue = "mapped";
      const mapped: Either<string, string> = either.mapRight(() => newValue);
      expect(mapped.isRight).toEqual(true);
      expect(mapped.unwrapRight()).toEqual(newValue);
    });
  });

  await test.step('"match" should', async (test) => {
    await test.step("execute the Right handler", () => {
      const handler = fn() as () => undefined;

      either.match({
        Right: handler,
        Left: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalled();
    });

    await test.step("pass the contained value to the handler", () => {
      const handler = fn() as () => undefined;

      either.match({
        Right: handler,
        Left: UNREACHABLE,
      });

      expect(handler).toHaveBeenCalledWith(value);
    });

    await test.step("return the randler result", () => {
      const handlerReturn = "some value";

      const value = either.match({
        Right: () => handlerReturn,
        Left: UNREACHABLE,
      });

      expect(value).toEqual(handlerReturn);
    });
  });
});
