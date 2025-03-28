---
title: 删除Mac自动生成的._文件
---

# 删除Mac自动生成的._文件

使用外接硬盘时Mac会自动生成`._`开头的文件。使用以下命令删除所有该类文件

:::code-group

```sh[MacOS]
dot_clean -m .
```

:::

删除失败的话，使用

:::code-group

```sh[MacOS]
find . -name ".DS_Store" -type f -delete ; find . -name "._*" -delete
```

```sh[Pwsh]
Get-ChildItem -Path . -Filter .DS_Store -Recurse -Force | Remove-Item -Force ; Get-ChildItem -Path . -Filter ._* -Recurse -Force | Remove-Item -Force
```

:::

删除当前目录及子目录下的`.DS_Store`和`._`文件
