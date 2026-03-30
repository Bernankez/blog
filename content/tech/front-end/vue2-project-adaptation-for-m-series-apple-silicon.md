---
title: Vue2 项目适配M系列 Apple Silicon
---

# Vue2 项目适配M系列 Apple Silicon

Vue2的老项目无法在M系列芯片的Mac上启动，大概率是由于`node-sass`依赖问题引起的，`node-sass`的原生二进制在ARM64 Mac上无法编译。解决思路是换Node版本 + 换Sass引擎 + 修复语法兼容性：

1. 指定Node版本为 `~16`

2. 替换`node-sass`为`dart-sass`

- `package.json`中去掉`node-sass`依赖

- 安装`"sass"`:`"~1.32.12"`

- 升级项目中的`"sass-loader"`到`"~7.3.1"`

- 在项目的vue config中的`cssLoaders`显式指定`implementation: require('sass')`:

```js
sass: generateLoaders('sass', {
  indentedSyntax: true,
  implementation: require('sass')
}),
scss: generateLoaders('sass', {
  implementation: require('sass')
}),
```

3. 全局替换`/deep/`为`::v-deep`

Dart Sass 不再支持`/deep/`深度选择器语法（会报 deprecation 错误），需要在所有 .vue 和 .scss 文件中：

- /deep/ .xxx → ::v-deep .xxx
- /deep/.xxx → ::v-deep .xxx
