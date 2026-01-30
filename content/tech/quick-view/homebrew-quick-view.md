---
title: Homebrew速查
---

# Homebrew速查

## 依赖查找

```sh
# 查找某个包是谁的依赖
brew uses --installed <package-name>

# 显示所有没有被依赖的包
brew leaves
```

## 清理

```sh
# 清理作为依赖安装且目前无主的包（孤儿包）--dry-run: 只显示哪些包会被清理，不实际清理
brew autoremove [--dry-run]

# 清理缓存和旧版本包
brew cleanup
```
