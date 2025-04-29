---
title: 禁用Cursor自动更新
---

# 禁用Cursor自动更新

1. 关闭Cursor

2. 清理已下载的更新缓存

<Collapse type="note" title="Windows">

手动删除`%USERPROFILE%\AppData\Local\cursor-updater`目录下的`pending`文件夹

</Collapse>

<Collapse type="default" title="MacOS">

```sh
rm -rf ~/Library/Application Support/Caches/cursor-updater/pending
```

</Collapse>

3. 完全卸载当前版本的Cursor

4. 从[这里](https://downloader-cursor.deno.dev/)下载一个历史Cursor版本。我下载的是0.42.5版本

5. 断开当前网络连接

6. 安装Cursor

7. 打开Cursor，设置中搜索`update`，将`Application/Update`下的自动更新模式设置为`none`

![](https://image-bed.keke.cc/202504291427559.png)

8. 关闭Cursor

9. 禁用自动更新

<Collapse type="note" title="Windows">

- 进入 `%USERPROFILE%\AppData\Local\Programs\cursor\resources`

- 将`app-update.yml`重命名为`app-update.yml.bak`

- 新建空白文件`app-update.yml`，并为文件设置`只读`属性

</Collapse>

<Collapse type="default" title="MacOS">

```sh
cd /Applications/Cursor.app/Contents/Resources
cp app-update.yml app-update.yml.bak
echo "" > app-update.yml
chmod 444 app-update.yml
```

</Collapse>

10. 重新连接网络，验证更新是否成功禁用

打开Cursor，打开命令面板，输入`> Attempt Update`执行。如果没有任何反应，说明禁用成功
