---
title: 小技巧
---

# 小技巧

文中部分css会用UnoCSS去写。

## 网页撑满全屏

> [!WARNING]
> 目前已经有了新的css单位`dvh`、`lvh`、`svh`专门用来解决这个问题，但是目前兼容性还不太好

不管子元素什么情况都能让网页撑满全屏。相比`100vh`的好处是，在高版本ios（即“safari浏览器的地址栏变到下面且浮动”的ios版本）上，也不会在内容未超出一屏时出现滚动条。

在外层元素上添加

```css
main {
  min-height: 100%;
  display: grid;
}
```

<CodePreview>
  <template #preview>
    <main class="bg-yellow p-3">
    father
    <div class="bg-gray">child</div>
    </main>
  </template>
  <template #code>

```html
<main class="min-h-full grid">
  <!-- child -->
</main>
```

  </template>
</CodePreview>

## 全面屏iPhone的Safe Area

> [!TIP]
> Reference: [Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

## CSS边框合并

使用`<table>`标签时可以通过设置`border-collapse: collapse`合并表格边框。对于非表格布局，可以对单元格使用`margin-right`, `margin-bottom`

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

通过`window.getComputedStyle(document.getElementsByClassName('hidden')[0])`获取到的`width`是`fit-content`。如果想要获取实际宽高，可以参考我写的这篇文章 ➡️ [获取隐藏元素（display: none）的样式](/blog/front-end/getting-styles-of-elements-with-display-none)

## 使用Cloudflare Workers实现域名代理

> [!TIP]
> Reference: [使用 Cloudflare Workers 解决 OpenAI 和 ChatGPT 的 API 无法访问的问题](https://github.com/noobnooc/noobnooc/discussions/9)

## 同时使用对象与数组解构

> [!TIP]
> Reference: [解构...使用对象还是数组？](https://antfu.me/posts/destructuring-with-object-or-array)

## 美化你的类型

> [!TIP]
> Playground: [Prettier your type](https://www.typescriptlang.org/zh/play?#code/C4TwDgpgBAYg9nKBeKBvAsAKClUkBcUAzsAE4CWAdgOYDcWOlAhgLYSEkU32YC+WWPNABCTUsjQMoAYzgBXSsEKU5LAEYRSPfpkHhoAYTgsJ8RADIoorQMxCoABVIRgwcpoA8AFQB8EjNhQANoA0lBUUADWECBwAGZQXgC6hF6hSVg6epCJECQSTi5unkYsPkA)

通过这个类型使你的类型提示显示完整的`{ type: string; name: string; count: number }`而不是`Foo & Bar`

```ts
type Prettier<T> = {
  [K in keyof T]: T[K]
};
```
