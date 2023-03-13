---
title: ts中的this伪参数
---

# ts中的this伪参数

::alert
Reference: [TypeScript 函数中的 this 参数](https://www.jianshu.com/p/8b3a2513d8e5)
::

TS2.0之后函数第一个参数可以是this，表明this的类型。说是伪参数，因为编译成js后并不会生成实际的参数，只是在ts中可以声明this的类型。比如想限制不能使用this，可以在参数中加`this:void`。