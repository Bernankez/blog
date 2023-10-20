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

function interceptor<T>(options?: InterceptorOption<T>) {}

const res1 = interceptor<string>(); // typeof res1 === string
const res2 = interceptor<number>({}); // typeof res2 === number
const res3 = interceptor<boolean>({ // typeof res3 === { name: string }
  responseTransformer(res) {
    return {
      name: "name"
    };
  }
});
```
我们希望以上三种函数调用方式都能够推导并返回正确的类型。这里我想讲一讲通过类型体操而不是函数签名重载的方式，来得到我们想要的类型。我们来添加一种`InferResponse`类型：
```ts
type InferResponse<T> = // ...

function interceptor<T>(options?: InterceptorOption<T>): InferResponse<T> {
  // ...
}
```
下来开始完善`InferResponse`。

---

首先我们可以发现，`interceptor`函数的返回值是与`options`的传参相关的，`options`传或不传、`options`中有没有`responseTransformer`会影响我们的返回值类型。所以`options`应该作为类型参数传入，也就是说放到泛型中。
```ts
interface Options<T> {
  responseTransformer?: (response: T) => any;
}

function interceptor<T, O extends Options<T>>(options?: O) {}
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
此时代码如下：
```ts
interface Options<T> {
  responseTransformer?: (response: T) => any;
}

type InferResponse<T, O> = O extends { transformer: (res: any) => any } ? ReturnType<O["transformer"]> : T;

function interceptor<T, O extends Options<T>>(options?: O) {
  return {} as InferResponse<T, O>;
}
```
这时候已经非常接近答案了，但是还有一个问题：
```ts
const res = interceptor<string>();
```
当我们只传泛型`T`时会提示，需要2个类型参数，但是`O`的类型我们希望从`options`中自动推导，我们需要给`O`一个默认值：
```ts
function interceptor<T, O extends Options<T> = Options<T>>(options?: O) {
  return {} as InferResponse<T, O>;
}
```
完整代码如下：
```ts
interface Options<T> {
  responseTransformer?: (response: T) => any;
}

type InferResponse<O, T> = O extends { responseTransformer: (res: any) => any } ? ReturnType<O["responseTransformer"]> : T;

function interceptor<T, O extends Options<T> = Options<T>>(options?: O) {
  return {} as InferResponse<O, T>;
}
```
此时我们的`interceptor`便能根据`options`返回正确的类型。