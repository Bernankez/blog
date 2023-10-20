---
title: TS从函数参数对象中推导返回值类型
---

# TS从函数参数对象中推导返回值类型

我们在做网络请求的时候经常会用到拦截器，在返回值拦截器中，我们可能会对返回值进行处理，并返回一个新的类型。因此我们会遇上这种需求：
```ts
interface InterceptorOption<T> {
  // ignore other props
  responseTransformer?: (res: T) => any;
}

function interceptor<T>(instance: (...args: any[]) => Promise<T>, options?: InterceptorOption<T>) {}

const api = () => Promise.resolve({ name: "bobo" });

const res1 = interceptor(api); // typeof res1 === { name: string }
const res2 = interceptor(api, {}); // typeof res2 === { name: string }
const res3 = interceptor(api, { // typeof res3 === { value: string }
  responseTransformer(res) {
    return {
      value: "bobo"
    };
  }
});
```
我们希望以上三种函数调用方式都能够推导并返回正确的类型。这里我想讲一讲通过类型体操而不是函数签名重载的方式，来得到我们想要的类型。我们来添加一种`InferResponse`类型：
```ts
type InferResponse<T> = // ...

function interceptor<T>(instance: (...args: any[]) => Promise<T>, options?: InterceptorOption<T>): InferResponse<T> {
  // ...
}
```
下来开始完善`InferResponse`。

---

首先我们可以发现，`interceptor`函数的返回值是与`options`的传参相关的，`options`传或不传、`options`中有没有`responseTransformer`会影响我们的返回值类型。所以`options`应该作为类型参数传入，也就是说放到泛型中。
```ts
interface InterceptorOption<T> {
  responseTransformer?: (response: T) => any;
}

function interceptor<T, O extends InterceptorOption<T>>(instance: (...args: any[]) => Promise<T>, options?: O) {}
```
相同的，`InferResponse`的泛型中也应该传入一项`O`，`InferResponse`应该根据`O`的不同返回不同的类型：
```ts
type InferResponse<T, O> = // ...
```
现在我们要根据`O`类型的不同做一些判断，并且我们希望从`O`中取到`responseTransformer`的返回值类型：
```ts
type InferResponse<T, O> = O extends { responseTransformer: (res: any) => any } ? ReturnType<O["responseTransformer"]> : T;
```
如果`O`中有`responseTransformer`并且`responseTransformer`为函数时，我们取它的返回值`ReturnType<O["responseTransformer"]>`；否则返回原本的`T`类型。
完整代码如下：
```ts
interface InterceptorOption<T> {
  responseTransformer?: (response: T) => any;
}

type InferResponse<T, O> = O extends { responseTransformer: (res: any) => any } ? ReturnType<O["responseTransformer"]> : T;

function interceptor<T, O extends InterceptorOption<T>>(instance: (...args: any[]) => Promise<T>, options?: O) {
  return {} as InferResponse<T, O>;
}
```
此时我们的`interceptor`便能根据`options`返回正确的类型。

---

其实一开始我要写的不是这个，一开始想做的是这种类型体操：
```ts
interface InterceptorOption<T> {
  // ignore other props
  responseTransformer?: (res: T) => any;
}

type InferResponse<T, O> = O extends { responseTransformer: (res: any) => any } ? ReturnType<O["responseTransformer"]> : T;

function interceptor<T, O extends InterceptorOption<T> = InterceptorOption<T>>(options?: O) {
  return {} as InferResponse<T, O>;
}

const res1 = interceptor<string>(); // typeof res1 === string
const res2 = interceptor<number>({}); // typeof res2 === number
const res3 = interceptor({ // typeof res3 === { value: string }
  responseTransformer(res) {
    return {
      value: "bobo",
    };
  },
});

// The problem is here
// Expected res4 is `{ value: string }`, but presenting `boolean`
const res4 = interceptor<boolean>({ // typeof res4 === boolean
  responseTransformer(res) {
    return {
      value: "bobo",
    };
  },
});
```
然后翻车了，没跳出来，想了两天也没想出怎么解决。这里有一个[TS Playground](https://www.typescriptlang.org/play?jsx=0#code/JYOwLgpgTgZghgYwgAgJLmkgDmA9lAeR2FxAB4AVAPmQG8AoZZAemeWAHMR8VcwALaMixRcWAM6NkUCOKylxEClDghxMfAFtoAfgBcyABQzxBigEpkAXhqqAngG56AX3r0wdrCnQxoAJVl5NQhKABpkAhorCOQIAA9IEAATcTppQIUlFTUNKG0oA2NZA3tLG2R7ZGdkHWQAsABXKBAKTxCCAG0AIhMgxWVVdS1oLoBdGjMnehgGkAQwEhB2DChsPCgwmPjElLQVtfwiBdJKKL3IVYgcQ+IT6ipDMWO1fQjLBiYZRua6arhUnz+DLBTaRJyuegIBRgdLiACM1mWFwOG3EYCgoA4D3MDhYbA8XlwMFhCKsZOQaIxIA4kOhsIATIjQMirusyCAGpoAEbQB60Zw4vHIAkQIkM6zkjnc6C0tQwkwAZiZ+1Z+EMtCFIrFiol0Q1ADc4AAbBoQAyUzFVKS9TIDHLDKBFcTvKSfCDfJYfJjew0ms3ILpc3BBrqhV1VJxMZxhgVTVjICiCYSiLlGiCadipQQyejxgCicS88wgSVhABZM8gAAYG42m83oy3OKvhLkNGEiWQQcCWqtB3Bp1RV2Vo8vKlnXDb9wcgPmatra2QVsnRacQVTW4H9bJDPLQJ0u73pD10cNMX31gNBkNho-OSNVGM4+hAA)，感兴趣的可以试一试。如果有人做出来了也欢迎评论！