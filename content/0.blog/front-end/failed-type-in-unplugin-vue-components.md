---
title: unplugin-vue-components自动导入的组件类型失效问题
---

# `unplugin-vue-components`自动导入的组件类型失效问题

VSCode中我们使用Volar作为Vue3的extension，这是前提。

我们都知道，ts中重复声明的interface会合并，可以实现接口的扩展。Volar就是基于重复声明`GlobalComponents`接口实现全局组件类型提示的。
当使用Vue3时，unplugin-vue-components自动生成的类型文件长这样：
```typescript
import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // global components
  }
}
```
从`vue/language-tools(volar)`的[源码](https://github.com/vuejs/language-tools/blob/dd1165b2456fcf3ef3f8b85e31172167afd99ed7/packages/vue-language-core/src/utils/directorySharedTypes.ts#LL37C35-L37C35)中我们可以看到，Volar是从`vue` `@vue/runtime-core` `@vue/runtime-dom`模块中导入`GlobalComponents`类型的。同时从Volar的[`README`](https://github.com/vuejs/language-tools/blob/dd1165b2456fcf3ef3f8b85e31172167afd99ed7/packages/vscode-vue/README.md?plain=1#L94)中我们也看到，Volar推荐在Vue3中从`@vue/runtime-core`模块中声明导出`GlobalComponents`。这一点是因为`README`中提到的一个vue的PR：https://github.com/vuejs/vue-next/pull/3399 。从这个PR的[这一行](https://github.com/vuejs/core/pull/3399/files#diff-46d7b958db6ca7a29e38904ab7a843ef8bbee73e3adcc435e2d2979b76c98e92R110)中我们可以看到，`GlobalComponents`是从`runtime-core/src/component.ts`导出的，这也是为什么Volar要我们从`@vue/runtime-core`中导出`GlobalComponents`接口。但是这个PR到目前为止都没有被合并，所以算是Volar为未来做的一个铺垫。

因此，回到我们的`unplugin-vue-components`导入的组件没有类型提示上，
我们可以从vue的`package.json`中看到，vue的`dependencies`里目前并没有`@vue/runtime-core`。如果你使用的是pnpm，pnpm为了避免幽灵依赖，默认是不会依赖提升的，这也就导致了`unplugin-vue-components`声明的类型文件中的`import '@vue/runtime-core'`无效。因此我们解决方法有两种：
1. 提升依赖

可以通过在`.npmrc`中声明`public-hoist-pattern`或者`shamefully-hoist`提升依赖：
```
public-hoist-pattern[]=*@vue/runtime-core*
# 或者
shamefully-hoist=true
```

::alert
Reference: <br>
[public-hoist-pattern](https://pnpm.io/zh/npmrc#public-hoist-pattern)<br>
[shamefully-hoist](https://pnpm.io/zh/npmrc#shamefully-hoist)
::

2. 直接安装`@vue/runtime-core`

```sh
pnpm add -D @vue/runtime-core
```
将`@vue/runtime-core`添加到项目的`devDependencies`，上面的导入就生效了。