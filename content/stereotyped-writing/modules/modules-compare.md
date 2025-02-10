---
title: ESModule, CommonJS
---

# ESModule, CommonJS

## ESModule

> [!NOTE]
> es的import在编译阶段就被执行，所以可以实现按需加载，在所有代码运行之前就被加载。

由于import是静态执行，所以不能使用表达式和变量。

import语句会**执行**所加载的模块，因此可以只执行模块而不输入任何值：

```javascript
import 'lodash'
```

以上代码仅执行`lodash`模块而不输入任何值

多次重复执行同一`import`语句只会执行一次

```javascript
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

虽然`foo`和`bar`在两个语句中加载，但他们对应同一个`my_module`模块，`my_module`模块只会执行一次。

模块也可以使用`*`整体加载：

```javascript
import { area, circumference } from './circle'
// 或
import * as circle from './circle'
```

> [!NOTE]
> 可以使用default为模块默认输出：

```javascript
export { add as defulat};
// 等价于
export default add;

import { default as foo } from 'modules';
// 等价于
import foo from 'modules';
```

export 与 import 复合写法

```javascript
export { foo, bar } from 'modules';
```

由于直接对外转发了这两个方法，所以不能直接使用foo,bar

```javascript
export { foo as myFoo } from 'modules';

export * from 'modules';

// 具名方法改为默认方法写法
export { es6 as default } from 'modules';
// 等价于
import { es6 } from 'modules';
export default es6;

// 默认方法改为具名方法
export { default as foo } from 'modules';

// ES2020补上了以下import语句的复合写法
import * as Bar from 'modules';

export * as Bar from 'modules';
// 等价于
import * as Bar from 'modules';
export { Bar };
```

> [!NOTE]
> 动态import类似于CommonJS的require，为运行时加载，与静态import的区别在于静态import在编译时就已分析好。但是动态import是异步加载，返回Promise，require是同步加载。

> [!TIP]
> [Module 的语法](https://wangdoc.com/es6/module.html)

动态import类似于CommonJS的require，为运行时加载，与静态import的区别在于静态import在编译时就已分析好。但是动态import是异步加载，返回Promise，require是同步加载。

## CommonJS

> [!NOTE]
> CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
>
> CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
>
> CommonJS 模块的`require()`是同步加载模块，ES6 模块的`import`命令是异步加载，有一个独立的模块依赖的解析阶段。
