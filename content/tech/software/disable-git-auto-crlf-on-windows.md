---
title: 禁用Windows下Git自动转换换行符
---

# 禁用Windows下Git自动转换换行符

众所周知，Windows和类UNIX系统下，换行符不一致：

| Windows | Linux/Mac | OSX  |
| :-----: | :-------: | :--: |
|  CRLF   |    LF     |  CR  |
| '\n\r'  |   '\n'    | '\r' |

而默认情况下，Windows上Git拉代码时会自动将换行符转换为CRLF。通过全局配置来禁用这一点：

```sh
git config --global core.autocrlf false
```
