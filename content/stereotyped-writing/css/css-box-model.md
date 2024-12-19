---
title: CSS盒模型
---

# CSS盒模型

> [!TIP]
> CSS中，所有元素都被“盒子（box）”包裹着。包括`margin`、`border`、`padding`、`content`。因此理解盒模型是掌握CSS布局的关键。

## 外部显示类型

盒子主要分为**块级盒子 block box**和**内联盒子 inline box**。两种盒子在**页面流 page flow**和元素关系方面会表现出不同的行为。

一个**block**盒子会表现出如下行为：

- 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，在绝大数情况下意味着盒子会和父容器一样宽
- 每个盒子都会换行
- [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 属性可以发挥作用
- 内边距（padding）, 外边距（margin）和 边框（border）会将其他元素从当前盒子周围“推开”

一个**inline**盒子会表现出如下行为：

- 盒子不会产生换行。
- [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 属性将不起作用。
- 垂直方向的内边距、外边距以及边框会被应用但是不会把其他处于 `inline` 状态的盒子推开。
- 水平方向的内边距、外边距以及边框会被应用且会把其他处于 `inline` 状态的盒子推开。

可以通过对盒子的`display`属性设置`inline`或`block`控制盒子的外显类型。

## 内部显示类型

盒子同样有一个用于内部显示的类型，比如常用的`flex`或`grid`，它们规定了盒子内部元素的排列方式。因此我们可以通过`display: inline-flex`同时指定盒子的外部和内部显示类型。

## 盒模型

盒模型包括了元素的**外边距margin**，**边框border**，**内边距padding**，**内容content**。

### 标准盒模型（默认）

```css
box-sizing: content-box;
```

这种盒模型下，width = content width，height = content height

![img](https://s2.loli.net/2023/08/15/ZxcJYkA95NDFmTR.webp)

### 替代盒模型

```css
box-sizing: border-box;
```

这种盒模型下，width = content width + padding X + border X，height = content height + padding Y + border Y

![img](https://s2.loli.net/2023/08/15/Md2nxRU9SaO6rgv.jpg)

## 外边距折叠（外边距合并）

> [!NOTE]
> 外边距折叠仅与垂直方向有关

有[三种情况](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)会形成外边距(margin)折叠：

- 相邻的兄弟元素

<CodePreview>
  <template #preview>
    <div class="bg-yellow overflow-auto">
      <div class="m-y-2 bg-green">brother1 我离上边距的距离是我的margin</div>
      <div class="m-y-6 bg-blue">brother2 我离下边距的距离是我的margin</div>
    </div>
  </template>
  <template #code>

```html
<div class="bg-yellow overflow-auto">
  <div class="m-y-2 bg-green">brother1 我离上边距的距离是我的margin</div>
  <div class="m-y-6 bg-blue">brother2 我离下边距的距离是我的margin</div>
</div>
```

</template>
</CodePreview>

可以看出brother1和brother2之间的距离小于brother1的margin+brother2的margin。

- 没有内容将父元素和后代元素分开

<CodePreview>
  <template #preview>
    <div class="bg-yellow">
      father
      <div class="bg-green m-3">child</div>
    </div>
  </template>
  <template #code>

```html
<div class="bg-yellow">
  father
  <div class="bg-green m-3">child</div>
</div>
```

</template>
</CodePreview>

这里实际上child上是有margin的，但是child的bottom和父元素bottom是挨着的。

- 空的区块

<CodePreview>
  <template #preview>
    <div class="bg-yellow">
      father
      <div class="bg-green m-t-1 m-b-3"></div>
    </div>
  </template>
  <template #code>

```html
<div class="bg-yellow">
  father
  <div class="bg-green m-t-1 m-b-3"></div>
</div>
```

</template>
</CodePreview>

father中包含了一个空的block，这个block的margin-top 0.25rem，margin-bottom 0.75rem，最终表现为0.75rem的margin。

## BFC (Block Formatting Context)（区块格式化上下文） <Badge type="info" text="CSS" />

> [!TIP]
> [区块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

> [!TIP]
> 区块格式化上下文（Block Formatting Context，BFC）是 Web 页面的可视 CSS 渲染的一部分，是块级盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

具有BFC特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且BFC具有普通容器所没有的一些特性。

### BFC的作用

- 包含内部浮动（内部布局）
- 排除外部浮动
- 阻止外边距重叠

### 如何创建BFC元素

- body根元素
- 浮动元素：`float`除`none`以外的值
- 绝对定位元素：`position: absolute/fixed`
- `display: inline-block/table-cell/flex/grid/flow-root`
- `overflow: hidden/auto/scroll`（除`visible`以外的值）

### BFC的特点

- 内部块级（block）盒子垂直方向排列
- 盒子垂直距离由margin决定，同一个BFC盒子的外边距会重叠
- BFC就是一个隔离的容器，内部子元素不会影响到外部元素
- BFC的区域不会与float box叠加
- 每个元素的margin box的左边，与包含块border box的左边相接触。即使存在浮动也是如此。

## IFC

与BFC相对的有IFC，这个应该比较少提到。

IFC只有在一个块元素中仅包含内联级别元素时才会生成

![img](https://s2.loli.net/2023/08/15/JKgDcN4YFwznlyo.jpg)

- 内部的`box` 会在水平方向排布
- 这些`box` 之间的水平方向的`margin` `boder` `padding` 都有效
- `Box`垂直对齐方式：以它们的底部、顶部对齐，或以它们里面的文本的基线（`baseline`）对齐（默认，文本与图片对其），例：`line-heigth`与`vertical-align`
