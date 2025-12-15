---
title: Git Worktree
---

# Git Worktree

`git worktree`是git中的一条命令，允许你**同时**工作在同一仓库的不同工作目录上，每个工作目录有自己的工作树，效果相当于你在两个不同目录下分别`git clone`了同一项目。比如当你有一个项目需要重构时，新分支需要参考老分支迁移功能，你可能想将两个分支同时打开用于比对，此时就该用上`git worktree`了。

## 创建新的工作树

```sh
git worktree add <path> <branch>

# 在../dev下创建新的工作树，并切换到dev分支
git worktree add ../dev dev
```

## 查看当前工作树

列出当前项目下所有工作树

```sh
git worktree list
```

## 移除工作树

移除指定路径下的工作树

```sh
git worktree remove <path>
```

## 锁定与解锁工作树

当你在重构时，可能希望防止意外修改原分支，此时可以锁定工作树

```sh
git worktree lock <path>
```

解锁工作树

```sh
git worktree unlock <path>
```
