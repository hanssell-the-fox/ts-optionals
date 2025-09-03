[![Deploy](https://github.com/hanssell-the-fox/ts-optionals/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/hanssell-the-fox/ts-optionals/actions/workflows/deploy.yml)
[![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE)

# Functional Types for TypeScript

A lightweight library that provides the benefits of functional data types, for a safer, and more expressive handling of values in ![TypeScript](https://www.typescriptlang.org).

Currently includes:

- ✅ `Option`: Safely represent values that may or may not be present (`Some` / `None`).
- ✅ `Result`: Represent results of tasks/actions that ended in _success_ or _failure_ (`Ok` / `Err`).
- 🛠️ Planned: Case matching, and other utility types

### Why?

*JavaScript* and *TypeScript* relies heavily on values like `null` and `undefined`, which often lead to bugs and verbose checks. This library provides functional primitives like `Option` and `Result` to handle those data types, and errors in a more explicit way.

### Getting Started

Here are some examples on how to use the library.

#### Option
```ts 
import { Some, None, Option } from "optionals"

const someValue: Option<number> = Some(10);

// Yes! You can check that way!
if (someValue instanceof Some){
  console.log(myValue.unwrap()); // 10
}

// Explicit ownership
const someValue: Option<number> = Some(10);
const iNeedTheValue     = someValue.expect("Should be the value 10");
const iAlsoNeedTheValue = someValue.unwrap(); // <- Throws an error

// Safely becomes None
const couldBeNull      = Some(null);      // Type becomes Option<never>
const couldBeUndefined = Some(undefined); // Type becomes Option<never>
console.log(couldBeNull.isSome);          // false
console.log(couldBeUndefined.isSome);     // false

// You shouldn't change the value 
const someValue: Option<number> = Some(1);
const addOneMore = someValue.map((n) => n + 1); // Returns an Option containing the value 2
console.log(addOneMore.unwrap());               // 2
console.log(someValue.unwrap());                // Still 1

// Watch out!
const danger: Option<never> = None();
const canIMapThis = danger.map((v) => v + 1);  // Yes... But, still without a value
console.log(canIMapThis.unwrap());             // Throws an error, there is no value!

const someValue: Option<number> = Some(10);
console.log(someValue instanceof Some);        // true
const gimmeYourData = someValue.unwrap();      // Lost his value
console.log(someValue instanceof None);        // true
```

#### Result 
```ts
import { Ok, Err, Result } from "optionals";

const someResult: Result<string, never> = Ok("Hello");

// Yes! You can check that way!
if (someResult instanceof Ok){
  console.log(someResult.unwrap()); // "Hello"
}

// Explicit ownership
const result: Option<string, never> = Ok("Hello");
const iNeedTheValue     = result.expect('Should have the message "Hello"'); 
console.log(iNeedTheValue);                // "Hello"
const iAlsoNeedTheValue = result.unwrap(); // <- Throws an error

const someError: Option<never, string> = Err("Some error");
const iNeedTheError     = someError.unwrapErr();
console.log(iNeedTheError);                      // "Some error"
const iAlsoNeedTheError = someError.unwrapErr(); // <- Throws and error

// You shouldn't change the value 
const someResult: Result<number, never> = Ok(1);
const addOneMore = someResult.map((n) => n + 1); // Returns a Result containing the value 2
console.log(addOneMore.unwrap());                // 2
console.log(someResult.unwrap());                // Still 1

// Can't map errors
const someError: Result<never, string> = Err("Some error");
const whatHappens = someError.map((e) => e + "Another error");
console.log(whatHappens.unwrapErr()); // "Some error"
console.log(whatHappens.unwrap())     // <- Throws because is an error

// Watch out!
const ok = Ok("OK");
ok.unwrap(); // <- Consumes the Result
console.log(ok instanceof Ok);  // false
console.log(ok instanceof Err); // false

const err = Err("ERROR");
err.unwrapErr(); // <- Consumes the Result
console.log(err instanceof Err); // false
console.log(err instanceof Ok);  // false
```

### Features

- Inspired by the control over the data in functional programming languages.
- No external dependencies smuggled under your nose...
- Fully typed, no surprises over the type of data you are working.
- Runtime safety is important, take good care of your data or it will bite your toe...

### Planned 

- [X] `Option` implementation
- [X] `Result` implementation
- [ ] Utility functions and combinators
- [ ] Better documentation
