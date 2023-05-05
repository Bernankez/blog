---
title: "display: flex下文本溢出处理"
---

# `display: flex`下文本溢出处理

## 原理

::alert
Reference: [如何解决flex文本溢出问题](https://juejin.cn/post/7118267018918232072#heading-0)

::

## 实现

::list{type="info"}
实现部分的代码为了方便，样式都是用UnoCSS写的
::

平常写页面时经常会遇到“文本超出部分显示省略号”这种需求：

::code-group
  ::code-block{label="Preview" preview}
    <div class="w-60 truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</div>
  ::
  ```html [Code]
    <div class="w-60 truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</div>
  ```
::

---

有时会有一些嵌套之类的复杂情况：

::code-group
  ::code-block{label="Preview" preview}
    <div class="w-130 bg-yellow-100">
      <div class="bg-red-300">
        <span class="bg-blue w-50 inline-block truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
        <span class="bg-green">这是一句不太长的话</span>
      </div>
      <div class="bg-yellow-300">这只是用来演示占位的</div>
    </div>
  ::
  ```html [Code]
    <div class="w-130 bg-yellow-100">
      <div class="bg-red-300">
        <span class="bg-blue w-50 inline-block truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
        <span class="bg-green">这是一句不太长的话</span>
      </div>
      <div class="bg-yellow-300">这只是用来演示占位的</div>
    </div>
  ```
::

对于上图这种情况，大多数时候我们想要的效果可能是绿色的部分宽度固定，蓝色部分填满红色部分剩余宽度，超出部分显示省略号。由于应用`text-overflow: ellipsis`的元素需要设置一个宽度才会生效，因此为了实现上述效果，我们配合`flex`布局一起使用

::code-group
  ::code-block{label="Preview" preview}
    <div class="w-130 bg-yellow-100">
      <div class="bg-red-300 flex">
        <span class="bg-blue truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
        <span class="bg-green shrink-0">这是一句不太长的话</span>
      </div>
      <div class="bg-yellow-300">这只是用来演示占位的</div>
    </div>
  ::
  ```html [Code]
    <div class="w-130 bg-yellow-100">
      <div class="bg-red-300 flex">
        <span class="bg-blue truncate">这是很长很长很长很长很长很长很长很长很长很长的一句话</span>
        <span class="bg-green shrink-0">这是一句不太长的话</span>
      </div>
      <div class="bg-yellow-300">这只是用来演示占位的</div>
    </div>
  ```
::

---

看起来还不错。然而我们来看这么一种情况：

::code-group
  ::code-block{label="Preview" preview}
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3">
        这是右侧父布局
        <div class="bg-blue">
            这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ::
  ```html [Code]
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
::

我们希望蓝色部分可以实现单行超出部分显示省略号，我们分别对红色和蓝色部分设置`text-overflow: ellipsis`以及对红蓝部分同时设置`text-overflow: ellipses`看看效果：

::code-group
  ::code-block{label="Preview" preview}
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3 truncate">
        这是右侧父布局 text-overflow: ellipsis
        <div class="bg-blue">
            这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ::
  ```html [Code]
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3 truncate">
        这是右侧父布局 text-overflow: ellipsis
        <div class="bg-blue">
            这是右侧嵌套的子布局。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ```
::

::code-group
  ::code-block{label="Preview" preview}
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3">
        这是右侧父布局
        <div class="bg-blue truncate">
            这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ::
  ```html [Code]
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3">
        这是右侧父布局
        <div class="bg-blue truncate">
            这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ```
::

::code-group
  ::code-block{label="Preview" preview}
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3 truncate">
        这是右侧父布局 text-overflow: ellipsis
        <div class="bg-blue truncate">
            这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ::
  ```html [Code]
    <div class="flex">
      <div class="bg-green shrink-0">这是左侧布局</div>
      <div class="bg-red p-3 truncate">
        这是右侧父布局 text-overflow: ellipsis
        <div class="bg-blue truncate">
            这是右侧嵌套的子布局。 text-overflow: ellipsis。这也是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的一句话
        </div>
      </div>
    </div>
  ```
::

可以发现，只有对红蓝部分同时设置`text-overflow: ellipsis`才能实现我们想要的效果。

---

再来看一种复杂情况，这是我最近在写一个播放器控制栏时遇到的：

::PlayerBarDemo
::
