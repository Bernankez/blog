---
title: 小技巧
---

# 小技巧

## 网页撑满全屏

> [!TIP]
> 2022年之后发布的浏览器，基本上已经全面支持了[`dvh`、`lvh`、`svh`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length#:~:text=dvb%2C%20dvh%2C%20dvi%2C%20dvmax%2C%20dvmin%2C%20dvw%20units)。这里提供的是一种替代方案。

相比于常规的`vh`，以下方式能实现类似`dvh`的效果。页面高度会随着地址栏的出现与消失而动态变化，但同时又能一直保持撑满全屏显示。

在外层元素上添加：

```css
main {
  min-height: 100%;
  display: grid;
}
```

## 全面屏iPhone的Safe Area

> [!TIP]
> [Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

## CSS实现边框合并

使用`<table>`标签时可以通过设置`border-collapse: collapse`合并表格边框。对于非`<table>`布局，可以对单元格使用`margin-right`, `margin-bottom`实现类似的效果：

```css
.cell {
  border: 1px solid #bfbfbf;
  margin-right: -1px;
  margin-bottom: -1px;
}
```

<CodePreview>
  <template #preview>
    <div class="grid grid-cols-3">
      <div class="b-1 b-solid b-[#bfbfbf] -m-r-1px -m-b-1px">cell</div>
      <div class="b-1 b-solid b-[#bfbfbf] -m-r-1px -m-b-1px">cell</div>
      <div class="b-1 b-solid b-[#bfbfbf] -m-r-1px -m-b-1px">cell</div>
      <div class="b-1 b-solid b-[#bfbfbf] -m-r-1px -m-b-1px">cell</div>
      <div class="b-1 b-solid b-[#bfbfbf] -m-r-1px -m-b-1px">cell</div>
      <div class="b-1 b-solid b-[#bfbfbf] -m-r-1px -m-b-1px">cell</div>
    </div>
  </template>
  <template #code>

```html
<div class="grid grid-cols-3">
  <div class="cell">cell</div>
  <div class="cell">cell</div>
  <div class="cell">cell</div>
  <div class="cell">cell</div>
  <div class="cell">cell</div>
  <div class="cell">cell</div>
</div>
```

</template>
</CodePreview>

## 获取隐藏元素样式

众所周知，`display: none`的元素无法获取到它的实际`width`, `height`。对`display: none`的元素使用`getComputedStyle`时，会显示原始css值。比如

```html
<div class="hidden">
  This is a hidden element.
</div>

<style>
.hidden {
  display: none;
  width: fit-content;
}
</style>
```

通过`window.getComputedStyle(document.getElementsByClassName('hidden')[0])`获取到的`width`是`fit-content`。如果想要获取实际宽高，可以参考我写的这篇文章 ➡️ [获取隐藏元素（display: none）的样式](/tech/front-end/getting-styles-of-elements-with-display-none)

## 使用Cloudflare Workers实现域名代理

> [!TIP]
> [使用 Cloudflare Workers 解决 OpenAI 和 ChatGPT 的 API 无法访问的问题](https://github.com/noobnooc/noobnooc/discussions/9)

## 使用[tunnl.gg](https://tunnl.gg/)临时反代出本机服务

当开发需要临时访问时很有用。使用一行命令即可：

```sh
# 8080为本机服务端口
$ ssh -t -R 80:localhost:8080 proxy.tunnl.gg
```

## 同时使用对象与数组解构

> [!TIP]
> [解构...使用对象还是数组？](https://antfu.me/posts/destructuring-with-object-or-array)

## 美化你的类型

> [!NOTE]
> [Prettier your type](https://www.typescriptlang.org/zh/play?#code/C4TwDgpgBAYg9nKBeKBvAsAKClUkBcUAzsAE4CWAdgOYDcWOlAhgLYSEkU32YC+WWPNABCTUsjQMoAYzgBXSsEKU5LAEYRSPfpkHhoAYTgsJ8RADIoorQMxCoABVIRgwcpoA8AFQB8EjNhQANoA0lBUUADWECBwAGZQXgC6hF6hSVg6epCJECQSTi5unkYsPkA)

```ts twoslash
type Prettier<T> = {
  [K in keyof T]: T[K]
};
```

通过这个类型使你的类型提示显示完整的`{ type: string; name: string; count: number }`而不是`Foo & Bar`，例如：

```ts twoslash
type Prettier<T> = {
  [K in keyof T]: T[K]
};

type Foo = {
  type: string;
}

type Bar = {
  name: string;
  count: number;
}

type FooBar = Foo & Bar;
type PrettyFooBar = Prettier<FooBar>;
```
