---
title: Webpack的动态导入
---

# Webpack的动态导入

> [!TIP]
> [代码分离 | webpack 中文文档 (docschina.org)](https://webpack.docschina.org/guides/code-splitting/#dynamic-imports)
>
> [webpack是如何实现动态导入的 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/73325163)

Webpack内部会用`Promise`实现dynamic import，而import内请求的路径则会**被当作moduleId**（`./src/async.js`），webpack会根据该id加载chunk下的module。
![](https://s2.loli.net/2023/03/15/rAqtNho4ZVgaHzd.png)
动态导入时webpack会使用

```javascript
eval(__webpack__require__(`./${path}`).then());
```

执行代码，所以import()中可以使用变量。
