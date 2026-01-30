---
title: uv速查
---

# uv速查

## 同步已有项目

### 项目中包含 `uv.lock` 或 `pyproject.toml`

```sh
# 同步环境（按锁文件安装）
uv sync

# 运行命令
uv run <command>
```

### 项目使用 `requirements.txt`

```sh
# 创建虚拟环境（默认name .venv）
uv venv [name] [--python 3.14]

# 安装依赖
uv pip install -r requirements.txt
```

## 初始化项目

```sh
# 创建应用项目（默认）
uv init

# 创建库项目
uv init --lib

# 指定 Python 版本
uv init --python 3.12
```

## 依赖管理

```sh
# 添加依赖
uv add <package-name>

# 移除依赖
uv remove <package-name>

# 查看依赖树
uv tree

# 更新锁文件
uv lock
```

```sh
# 为脚本添加依赖（无需项目）
uv add --script <path/to/script.py> <package-name>
```
