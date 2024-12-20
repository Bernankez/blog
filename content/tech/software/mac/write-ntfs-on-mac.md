---
title: Mac下读写NTFS
---

# Mac下读写NTFS

Mac下默认对NTFS是只读的，如果想要写入NTFS，需要一些额外的操作。

0. 前置条件

已安装`homebrew`

1. 安装`macfuse`

```sh
# 安装之前确认是否打开了允许任何来源，没打开的先执行下面的命令
sudo spctl --master-disable
# 安装macfuse
brew install --cask macfuse
```

2. 安装`ntfs-3g-mac`

```sh
brew tap gromgit/homebrew-fuse
brew install ntfs-3g-mac
```

3. 修改安全等级

打开系统设置->隐私与安全性->安全性->你当前的安全性设置阻止安装系统扩展->启用系统扩展。

关机->长按开机键->点击“选项”->选中管理员用户->点击顶部菜单栏“实用工具”->启动安全性实用工具->选中系统盘->右下角“安全策略”->勾选“降低安全性”->勾选“允许用户管理来自被认可开发者的内核扩展”->左上角重启系统。

再次打开系统设置->隐私与安全性->安全性->允许来自“Benjamin Fleischer”的系统扩展->重启系统。

4. 挂载

插入U盘，终端中输入以下命令

```sh
mount | grep ntfs
```

得到类似于`/dev/disk4s1 on /Volumes/xxxxxxxx (ntfs, local, nodev, nosuid, read-only, noowners, noatime, fskit)`

接着输入（使用你实际的值替换命令中的`/dev/disk4s1`和`xxxxxxxx`）

```sh
# 先卸载U盘
sudo umount /dev/disk4s1
# 再重新挂载
sudo -S $(which ntfs-3g) /dev/disk4s1 /Volumes/xxxxxxxx -o local -o allow_other -o auto_xattr -o volname=xxxxxxxx
```

此时打开Finder，NTFS已可读写
