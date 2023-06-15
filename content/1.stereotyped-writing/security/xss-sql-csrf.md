---
title: XSS、SQL与CSRF
---

# XSS、SQL与CSRF

XSS(Cross-Site Scripting，跨站点脚本攻击)，SQL注入，CSRF(Cross-Site Request Forgery，跨站点请求伪造)

三者都是网站攻击的手段。

### 原理

- XSS通过代码注入的方式攻击
- CSRF通过利用网站本身的漏洞，请求网站的API

### 攻击对象

- XSS攻击服务器
- CSRF通过用户发起攻击

### 是否必须需要cookie

- XSS不需要
- CSRF必须获取到cookie才能进行

## 解决手段

- 输入过滤（转义等），永远不要相信用户的输入
- 输出编码，将用户输入数据输出到页面时，先进行编码，将所有文字都当成普通文字而非html代码
- cookie中避免存放隐私。cookie中可加入token比对，也可将cookie与ip绑定
- 关键操作加验证码
- 使用Header传递token，攻击者无法获取到token
