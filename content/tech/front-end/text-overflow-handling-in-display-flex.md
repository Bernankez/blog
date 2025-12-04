---
title: "display: flex下文本溢出处理"
---

# `display: flex`下文本溢出处理

## 原理

> [!TIP]
> [如何解决flex文本溢出问题](https://juejin.cn/post/7118267018918232072#heading-0)

## 实现

> [!NOTE]
> 实现部分的代码为了方便，样式都是用UnoCSS写的

平常写页面时经常会遇到“文本超出部分显示省略号”这种需求：

<CodePreview>
  <template #preview>
    <div class="w-60 truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</div>
  </template>
  <template #code>

```html
<div class="w-60 truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</div>
```

</template>
</CodePreview>

---

有时会有一些嵌套之类的复杂情况：

<CodePreview>
  <template #preview>
    <div class="w-130 bg-yellow-100">
      <div class="bg-red-300">
        <span class="bg-blue w-50 inline-block truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
        <span class="bg-green">这是一句不太长的话</span>
      </div>
    </div>
  </template>
<template #code>

```html
<div class="w-130 bg-yellow-100">
  <div class="bg-red-300">
    <span class="bg-blue w-50 inline-block truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
    <span class="bg-green">这是一句不太长的话</span>
  </div>
  <div class="bg-yellow-300">这只是用来演示占位的</div>
</div>
```

</template>
</CodePreview>

对于上图这种情况，大多数时候我们想要的效果可能是绿色的部分宽度固定，蓝色部分填满红色部分剩余宽度，超出部分显示省略号。由于应用`text-overflow: ellipsis`的元素需要设置一个宽度才会生效，因此为了实现上述效果，我们配合`flex`布局一起使用

<CodePreview>
  <template #preview>
    <div class="w-130 bg-yellow-100">
      <div class="bg-red-300 flex">
        <span class="bg-blue truncate">这是很长很长很长很长很长很长很长很长很长的一句话</span>
        <span class="bg-green shrink-0">这是一句不太长的话</span>
      </div>
    <div class="bg-yellow-300">这只是用来演示占位的</div>
  </div>
</template>
<template #code>

```html
<div class="w-130 bg-yellow-100">
  <div class="bg-red-300 flex">
    <span class="bg-blue truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
    <span class="bg-green shrink-0">这是一句不太长的话</span>
  </div>
  <div class="bg-yellow-300">这只是用来演示占位的</div>
</div>
```

</template>
</CodePreview>

---

看起来还不错。然而我们来看这么一种情况：

<CodePreview>
  <template #preview>
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3">
        这是右侧父布局
        <div class="bg-blue">
          这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  </template>
  <template #code>

```html
<div class="flex">
  <div class="bg-green shrink-0">这是左侧布局</div>
  <div class="bg-red p-3">
    这是右侧父布局
    <div class="bg-blue">
        这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
    </div>
  </div>
</div>
```

</template>
</CodePreview>

我们希望蓝色部分可以实现单行超出部分显示省略号，我们分别对红色和蓝色部分设置`text-overflow: ellipsis`以及对红蓝部分同时设置`text-overflow: ellipses`看看效果：

<CodePreview>
  <template #preview>
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3 truncate">
        这是右侧父布局 text-overflow: ellipsis
        <div class="bg-blue">
          这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  </template>
  <template #code>

```html
<div class="flex">
  <div class="bg-green shrink-0">这是左侧布局</div>
  <div class="bg-red p-3 truncate"> <!-- [!code highlight] -->
    这是右侧父布局 text-overflow: ellipsis
    <div class="bg-blue">
        这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
    </div>
  </div>
</div>
```

</template>
</CodePreview>

<CodePreview>
  <template #preview>
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3">
        这是右侧父布局
        <div class="bg-blue truncate">
          这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  </template>
  <template #code>

```html
<div class="flex">
  <div class="bg-green shrink-0">这是左侧布局</div>
  <div class="bg-red p-3">
    这是右侧父布局
    <div class="bg-blue truncate"> <!-- [!code highlight] -->
        这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
    </div>
  </div>
</div>
```

</template>
</CodePreview>

<CodePreview>
  <template #preview>
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3 truncate">
        这是右侧父布局 text-overflow: ellipsis
        <div class="bg-blue truncate">
          这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  </template>
  <template #code>

```html
<div class="flex">
  <div class="bg-green shrink-0">这是左侧布局</div>
  <div class="bg-red p-3 truncate"> <!-- [!code highlight] -->
    这是右侧父布局 text-overflow: ellipsis
    <div class="bg-blue truncate"> <!-- [!code highlight] -->
        这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
    </div>
  </div>
</div>
```

</template>
</CodePreview>

可以发现，只有对红蓝部分同时设置`text-overflow: ellipsis`才能实现我们想要的效果。

---

再来看一种复杂情况，这是我最近在写一个播放器控制栏时遇到的：

<div class="flex flex-col flex-gap-4">
  <p>
    我希望这里的歌名可以实现超出一行时使用省略号的效果
  </p>
  <div class="w-full bg-green">
    <div class="flex items-center flex-gap-4">
      <div class="h-10 w-10 shrink-0 bg-gray">
        头像
      </div>
      <div class="w-full flex flex-col flex-gap-1 bg-blue">
        <div class="bg-orange-300">
          这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
        </div>
        <div class="bg-orange-100">
          歌手
        </div>
      </div>
      <div class="flex shrink-0 items-center flex-gap-2">
        <div class="bg-red">
          一些播放控制按钮
        </div>
      </div>
    </div>
  </div>
  <p>
    正常情况下我只需要像上面的例子一样，对橙色以及它的父级蓝色部分设置text-overflow: ellipsis就行
  </p>
  <div class="w-full bg-green">
    <div class="flex items-center flex-gap-4">
      <div class="h-10 w-10 shrink-0 bg-gray">
        头像
      </div>
      <div class="w-full flex flex-col flex-gap-1 truncate bg-blue">
        <div class="truncate bg-orange-300">
          这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
        </div>
        <div class="bg-orange-100">
          歌手
        </div>
      </div>
      <div class="flex shrink-0 items-center flex-gap-2">
        <div class="bg-red">
          一些播放控制按钮
        </div>
      </div>
    </div>
  </div>
  <p>
    但是，因为一些其他原因，导致我现在必须对整个控制栏，即绿色部分，设置position: absolute
  </p>
  <div class="w-full bg-green">
    <div class="absolute flex items-center flex-gap-4">
      <div class="h-10 w-10 shrink-0 bg-gray">
        头像
      </div>
      <div class="w-full flex flex-col flex-gap-1 truncate bg-blue">
        <div class="truncate bg-orange-300">
          这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
        </div>
        <div class="bg-orange-100">
          歌手
        </div>
      </div>
      <div class="flex shrink-0 items-center flex-gap-2">
        <div class="bg-red">
          一些播放控制按钮
        </div>
      </div>
    </div>
  </div>
  <p class="pt-13">
    这时你会发现整个绿色部分的高度已经塌缩不见了，我们先不管这一点。将你的浏览器宽度拉小一点，你会发现text-overflow: ellipsis已经不是我们想要的效果了。虽然仍然有省略号，但x方向上已经超出了页面的范围。
  </p>
  <p>
    解决方法：对蓝色部分添加
  </p>

```css
.blue {
  flex: auto;
  /* 或min-width: 0; */
  width: 0;

  /* 去掉width: 100%; */

  /* 可去可不去 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

<p>此时就已经生效了。</p>
  <div class="w-full bg-green">
    <div class="absolute w-full flex items-center flex-gap-4">
      <div class="h-10 w-10 shrink-0 bg-gray">
        头像
      </div>
      <div class="w-0 flex flex-auto flex-col flex-gap-1 bg-blue">
        <div class="truncate bg-orange-300">
          这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
        </div>
        <div class="bg-orange-100">
          歌手
        </div>
      </div>
      <div class="flex shrink-0 items-center flex-gap-2">
        <div class="bg-red">
          一些播放控制按钮
        </div>
      </div>
    </div>
  </div>
  <p class="m-t-13">
  </p>
</div>
