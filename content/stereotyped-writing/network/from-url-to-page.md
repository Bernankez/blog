---
title: 从输入网址到显示网页
---

# 从输入网址到显示网页

## DNS解析

DNS缓存检查顺序：

- 首先检查浏览器缓存。浏览器有个固定期限的dns存储库。
- 检查操作系统缓存。一般是在hosts文件中。
- 检查路由器缓存，路由器中也有一份dns缓存。
- 检查ISP（互联网服务提供商）（运营商）缓存，ISP有个dns服务器记录dns缓存
- ISP向根dns服务器发起请求，进行递归查询

## TCP三次握手发起连接

> [!TIP]
> [TCP三次握手与四次挥手](https://blog.keke.cc/stereotyped-writing/network/tcp-connect)

## 发送HTTP请求

> [!TIP]
> [HTTP1.1与HTTP2](https://blog.keke.cc/stereotyped-writing/network/http-protocol)

## 服务器处理请求

## 服务器返回HTTP响应

## 浏览器解析页面

- 根据HTML解析出DOM树
- 根据CSS解析生成CSS规则树
- 结合DOM树和CSS规则树，生成渲染树
- 根据渲染树计算节点信息
- 根据节点信息绘制页面

## TCP四次挥手断开连接

> [!TIP]
> [TCP三次握手与四次挥手](https://blog.keke.cc/stereotyped-writing/network/tcp-connect)
