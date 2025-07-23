[![Deploy](https://github.com/hanssell-the-fox/ts-optionals/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/hanssell-the-fox/ts-optionals/actions/workflows/deploy.yml)
[![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE)

# Functional Types for TypeScript

*For a better control of your data*

A lightweight library that provides the benefits of functional data types, for a safer, and more expressive handling of values in ![TypeScript](https://www.typescriptlang.org).

Currently includes:

- ✅ `Option`: Safely represent values that may or may not be present (`Some` / `None`)
- 🛠️ Planned: `Result`, and other utility types

### Why?

*JavaScript* and *TypeScript* relies heavily on values like `null` and `undefined`, which often lead to bugs and verbose checks. This library provides functional primitives like `Option` and `Result` to handle those data types, and errors in a more explicit, declarative way. (no more **try...catch**, you need take care of it!)

### Getting Started

```ts 
import { Some, None, Option } from "./mod.ts"

const someValue: Option<number> = Some(10);

// Yes! You can check that way!
if (someValue instanceof Some){
  console.log(myValue.unwrap); // 10
}

// Explicit ownership
const someValue: Option<number> = Some(10);
const iNeedTheValue     = someValue.unwrap; // <- Takes ownership of the value
const iAlsoNeedTheValue = someValue.unwrap; // <- Throws an error

// Safely becomes None
const couldBeNull      = Some(null);      // Type become Option<never>
const couldBeUndefined = Some(undefined); // Type become Option<never>
console.log(couldBeNull.isSome);          // false
console.log(couldBeUndefined.isSome);     // false

// Can't change the value
const someValue: Option<number> = Some(1);
const addOneMore = someValue.map((n) => n + 1); // Returns 2
console.log(addOneMore.unwrap);                 // 2
console.log(someValue.unwrap);                  // Still 1

// Watch out!
const danger: Option<never> = None();
const canIMapThis = danger.map((v) => v + 1);  // Yes... But, still without a value
console.log(canIMapThis.unwrap);               // Throws an error, there is no value!

const someValue: Option<number> = Some(10);
console.log(someValue instanceof Some);        // true
const gimmeYourData = someValue.unwrap;        // Lost his value
console.log(someValue instanceof None);        // true
```

### Features

- Inspired by the control over the data in functional programming languages.
- No external dependencies smuggled under your nose...
- Fully typed, no surprises over the type of data you are working.
- Runtime safety is important, take good care of your data or it will bite your toe...

### Planned 

- [X] `Option` implementation
- [ ] `Result` implementation
- [ ] Utility functions and combinators
- [ ] Better documentation
