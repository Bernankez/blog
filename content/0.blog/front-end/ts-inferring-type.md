---
title: TS函数重载类型推断
---

# TS函数重载类型推断

::alert
Reference: [TypeScript: Documentation - Conditional Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
::

当从函数重载推断类型时，只会从最后一个函数签名中推断，比如：

```typescript
interface EventBus {
  (event: 'refresh', type: string):void;
  (event: 'query', data: number):void;
}

type Inferred = Parameters<EventBus> extends [infer K, ...infer U] ? U : never;
// type Inferred === [number]
```
::callout
#summary
当从多个调用签名中推断类型时（比如函数重载类型），总是会从*最后一个*签名中推断（因为是最有可能包含所有情况的签名）。这里没有办法展示出重载的参数类型数组。
#content
When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the *last* signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.
::
