---
title: Mac安装软件提示“xxx已损坏，无法打开。 您应该将它移到废纸篓”
---

# Mac安装软件提示“xxx已损坏，无法打开。 您应该将它移到废纸篓”

## 开启“允许任何来源”

Mac从Sierra 10.12 开始，已经去除了允许“任何来源”的选项，需要通过命令行开启。打开终端，输入：

```sh
sudo spctl --master-disable
```

打开设置-隐私与安全性，翻到最下面，可以看到“任何来源”已经选定。此时打开刚刚无法安装的app。如果还是打不开，那接着往下看。

## 修改文件权限

打开终端，输入：

```sh
sudo xattr -r -d com.apple.quarantine /Applications/xxx.app
```

其中`Applications/xxx.app`为你的app所在路径，你也可以直接将app拖进终端获取它的位置。执行完成后，此时app应该可以正常使用了。
