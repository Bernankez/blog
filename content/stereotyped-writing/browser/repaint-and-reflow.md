---
title: 重绘与重排（回流）
---

# 重绘与重排（回流） <Badge type="info" text="BLOOMCHIC" />

浏览器中页面解析过程：

> 现在浏览器已经没有Render Tree了，会生成一颗布局树，然后分层，再提交到合成线程进行光栅化，生成位图。

- HTML解析成DOM树
- CSS解析成CSSOM树
- 结合DOM树和CSSOM树，生成渲染树（Render Tree）
- 生成布局（flow），浏览器在屏幕上画出渲染树中的所有节点
- 将布局绘制（paint）在屏幕上，显示出整个页面

![image](https://s2.loli.net/2023/08/16/fS1blKAEmpU4PID.webp)

在页面的生命周期中，网页生成的时候，至少会渲染一次。在用户访问过程中，还会不断触发重绘与重排。

- **重绘**：某些元素外观被改变，如元素填充色。（需要重新绘制）
- **重排**：重新生成布局，重新排列元素。（布局需要重新排列）

重绘不一定重排，但重排一定导致重绘。

## 重排（reflow）

以下情况会触发重排：

- 页面初始渲染。这是开销最大的一次重排
- 添加/删除可见DOM元素
- 改变元素位置
- 改变元素尺寸，如padding、margin、border、width、height等
- 改变元素内容，如文字数量，图片大小等
- 改变字体大小
- 改变浏览器窗口尺寸，如resize
- 激活CSS伪类，如`:hover`
- 设置style属性值。通过设置style属性改变节点样式，每一次设置都会触发一次重排
- 查询`offsetWidth` `offsetHeight`等属性或调用`getComputedStyle`等方法。这些属性需要即时性和准确性

影响范围：

- 全局范围
- 局部范围

## 重绘（repaint）

元素外观发生改变，但布局没有改变。

## 重排优化

- 减少重排范围

- 减少重排次数

  1. 样式集中改变

  2. 分离读写操作

     DOM的读操作放在一起，写操作放在一起

  3. DOM离线

     使用`display: none`或`documentFragment`将元素从页面上拿掉，操作完后再放回去

  4. 使用`absolute`或`fixed`脱离文档流

  5. 优化动画

     动画放到`absolute`或`fixed`元素上。使用`transform`做动画而不是`left` `right`。启用GPU加速
