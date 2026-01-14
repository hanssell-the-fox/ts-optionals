[![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE)

# Optionals for TypeScript 🦊

A small and lightweight library that brings the benefits of _optional_ types
to TypeScript, helping you write expressive, predictable, and safer code 
— without unnecessary noise.

### Why?

JavaScript and TypeScript rely heavily on `null` and `undefined`. They lurk
everywhere like hidden traps, often leading to bugs, boilerplate checks,
or confusing behavior.

This library provides functional primitives such as **Option** and **Result** to
handle missing data — and even errors — in a clean, explicit, and elegant way.

### Getting Started

Here are some quick examples.

#### Option
```ts 
import { Some, None, Option } from "@hans/ts-optionals";

async function fetchUser(id: string): Option<User> {
  const data = await fetchUserFromDB(id);
  return (data) ? Some(data) : None;
}

const username: string = await fetchUser("123").match({
  Some: (user) => user.name,
  None: () => "anonymous"
});
```

#### Result 
```ts
import { Ok, Err, Result } from "@hans/ts-optionals";

async function fetchUser(id: string): Result<User, string> {
  try {
    const data = await userDb.fetch(id);
    return data ? Ok(data) : Err(`No user found for id: ${id}`)
  } catch {
    return Err(`Unable to fetch data for user with id: ${id}`);
  }
}

const username: string = await fetchUser("123").match({
  Ok: (user) => user.name,
  Err: () => "anonymous"
});
```

#### Either
```ts
import { Left, Right, Either } from "@hans/ts-optionals";

async function fetchUser(id: string): Either<User, AnonymousUser> {
  const data = await userDB.fetch(id);
  return data ? Left(data) : Right(new AnonymousUser());
}

const username: string = await fetchUser("123").match({
  Left: (user) => user.name,
  Right: (user) => user.name,
});
```

#### Changes 

#### v1.1.0 

- Added `isNullable` as utility function.
- Added type `NonNullable<T>`.
- Added type `Nullable<T>`.
- Added type `Generic<T>`.
- Changed `Option` to only accepts non-nullable values as a valid `Some`.
