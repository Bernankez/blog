---
title: Generator函数的中断与恢复
---

# Generator函数的中断与恢复

::alert
Reference: https://github.com/pro-collection/interview-question/issues/387
::

Generator是JS中一种特殊的函数，它能通过迭代器协议（Iterator Protocol）实现中断与恢复功能。

Generator函数使用`function*` 声明，调用Generator函数时不会立即执行，而是返回一个迭代器对象。通过调用迭代器的`next()`方法，可以逐步执行Generator函数。Generator函数内部可以使用`yield`关键字定义中断点。当调用`next()`时，会从上次暂停的地方继续执行，直到遇到下一个`yield`关键字或函数结束。通过不断调用`next()`方法，可以逐步执行Generator函数，并获取每个中断点处的值。

```ts
function* generatorFunction() {
  console.log("1");
  yield;
  console.log("2");
  yield;
  console.log("3");
}

const generator = generatorFunction();

generator.next(); // 1
generator.next(); // 2
generator.next(); // 3
```

由于Generator函数具有中断和恢复的特性，可以用于异步编程。通过`yield`关键字，将异步操作分割成多个步骤，每个步骤都可以通过`yield`暂停，等待异步操作完成后再恢复执行。

## 获取中断点处的值

```ts
function* generatorFunction() {
  yield "hello";
  yield "world";
  yield "ending";
}

const generator = generatorFunction();

const a = generator.next(); // { value: "hello", done: false }
const b = generator.next(); // { value: "world", done: false }
const c = generator.next(); // { value: "ending", done: true }
const d = generator.next(); // { value: undefined, done: true }
```

## `yield*`

`yield*`用来在一个Generator函数里**执行**另一个Generator函数。

```ts
function* foo() {
  yield "aaa";
  yield "bbb";
}

function* bar() {
  yield * foo();
  yield "ccc";
  yield "ddd";
}

const generator = bar();

const a = generator.next(); // { value: "aaa", done: false }
const b = generator.next(); // { value: "bbb", done: false }
const c = generator.next(); // { value: "ccc", done: false }
const d = generator.next(); // { value: "ddd", done: false }
const e = generator.next(); // { value: undefined, done: true }
```

`bar`里面，执行到`e`这一步`done`才变成`true`是因为，`bar`实际上相当于是

```ts
function* bar() {
  yield * foo();
  yield "ccc";
  yield "ddd";
  return undefined;
}
```

所以遇到`return`才done。

## `next()`的参数

`yield`表达式本身没有返回值。比如

```ts
const result = yield 3 + 4 + 5;
```

当执行到`yield 3 + 4 + 5`的时候会暂停；当执行`next()`方法后，此时执行`const result = [yield 3 + 4 + 5]`，这个时候`result`的值是`undefined`。

但是`next()`可以传一个参数，这个参数会被当作`yield`的返回值。因此如果执行`next(10)`，此时`result`的值则为`10`。即`const result = next(10)`。

## `for...of`

迭代器对象（Iterator）可以使用`for...of`遍历。这里需要注意，一旦`next()`方法的返回对象的`done`属性为`true`，`for...of`循环就会终止，且不包含该返回对象。

```ts
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  return 5;
}

for (const item of generatorFunction()) {
  console.log(item);
}

// 1
// 2
// 3
// 4
```

## `Generator.prototype.return`

`return`方法可以提前终结遍历器函数

```ts
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = generatorFunction();

generator.next(); // { value: 1, done: false }
generator.return("end"); // { value: "end", done: true }
generator.next(); // { value: undefined, done: true }
```

