---
title: Vercel浅克隆导致的文件Git信息不准确问题
---

# Vercel浅克隆导致的文件Git信息不准确问题

根据[Vercel文档](https://vercel.com/docs/builds/configure-a-build#configuring-a-build:~:text=git%20clone%20%2D%2Ddepth%3D10%20(...))，Vercel在部署时只会克隆最近10次的提交记录，因此会导致一个问题，当你的网站需要基于Git文件信息显示内容时，获取到的信息会不准确，比如Vitepress的Last Updated就是根据文件的Git信息获取时间戳。关于这一点Vitepress在[文档](https://vitepress.dev/reference/default-theme-last-updated#last-updated)中也提到了，也给了一个基于GitHub Actions的解决方案：

```yaml
- name: Checkout
  uses: actions/checkout@v5
  with:
    fetch-depth: 0  # [!code highlight]
```

但是使用Vercel部署时是不经过GitHub Action的。文档中另外也给了一个修改`docs:build`命令的方法：

```json
"docs:build": "git fetch --unshallow && vitepress build docs"
```

不过经过尝试，`git fetch --unshallow`在Vercel中部署时依然没法正确显示Last Updated。

搜索之后在Vercel的[Discussions](https://github.com/vercel/vercel/discussions/5737#discussioncomment-8909996)中看到有一条相关回答，在Vercel的环境变量中设置`VERCEL_DEEP_CLONE=true`。然而经过尝试，Vercel在pull代码时会卡在`There was a permanent problem cloning the repo.`，并且一直重复输出这个。看来这个方法也行不通。

那么还有办法吗？有的，根据[这条评论](https://github.com/vercel/vercel/discussions/5737#discussioncomment-7984929)，以及[这篇博客](https://mark9804.github.io/blog/breves/frontend/vercel-deep-clone)，我们可以修改`vercel.json`中的`installCommand`（或者在Vercel项目配置页面修改install command），达到拉取完整Git记录的目的。

在`vercel.json`中添加`installCommand`配置：

::: code-group

```json [vercel.json]
{
  "installCommand": "git pull --unshallow [你的Git地址] [分支名] && pnpm install"
}
```

:::

这样部署上去之后，Vitepress的Last Updated就可以正常显示了。
