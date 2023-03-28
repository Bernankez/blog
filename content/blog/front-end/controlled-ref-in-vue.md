---
title: Vue的受控ref
---

# Vue的受控ref

::list{type="info"}
这里的ref指的是作用在attribute上的ref（`<div ref="divRef">something</div>`）
::

除了我们普通的绑定ref的写法，Vue的ref还支持自定义存储位置

::alert
![](https://s2.loli.net/2023/03/28/vzM92iAWfc3ngye.png)

Reference: [ref - Vue.js](https://cn.vuejs.org/api/built-in-special-attributes.html#ref)
::

ref的类型定义：
```ts
export declare type VNodeRef = string | Ref | ((ref: Element | ComponentPublicInstance | null, refs: Record<string, any>) => void);
```

这种受控ref在一些特殊情况下会很有用。比如一般我们在使用组件库的`table`组件时，可能需要通过传`slot`，或`columns`之类的属性来定义列。如果这时我们想对自定义列中的元素绑定ref，由于这里不是直接对列进行`v-for`（`<div v-for="i in 3" :key="i" ref="divRef"></div>`），因此我们无法获取到对应的ref数组，只会拿到一个单一的VueInstance。此时我们可以通过定义函数ref对每一个ref单独存储。