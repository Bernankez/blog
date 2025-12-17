---
title: 通过GitHub + Cloudflare自建图床
---

# 通过GitHub + Cloudflare自建图床

使用自建图床有以下好处：

- 免费。
- 加速。Cloudflare的CDN可以缓存GitHub内容，减少源站请求，加快图片加载速度。
- 支持自定义域名。
- 安全。Cloudflare提供免费HTTPS保护。
- 数据完全掌握在自己手里。

## 前期准备

- GitHub Personal access token (classic) [scope:repo]

  登录GitHub, 访问 https://github.com/settings/tokens ，选择 “Generate new token (classic)”，获取一个access token（权限只需要勾选repo，过期时间选择 No expiration（永不过期））生成后记得保存下来，之后你就再也看不到了。

  ![](https://image-bed.keke.cc/202512171518572.png)

- 一个GitHub私有仓库

- TinyPNG API Key（可选）

  进入 https://tinypng.com/developers 注册一个账号，保存下创建的API Key

  ![](https://image-bed.keke.cc/202512171555274.png)

- 一个域名

- Cloudflare账户

## Cloudflare创建Worker

进入Cloudflare账户，计算和AI - Workers 和 Pages，创建一个新的Worker，这里我取名叫image-bed

将以下代码复制到 `worker.js` 中

```js
/**
 * Cloudflare Worker Github Raw Proxy
 * 功能：
 * 1. 代理访问 GitHub Raw 文件
 * 2. 支持 Token 鉴权（通过密码使用内置 Token 或直接传递 Token）
 * 3. 首页伪装成 Nginx 或随机跳转
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 路由分发：根路径处理首页逻辑，其他路径处理代理逻辑
    if (url.pathname === "/" || url.pathname === "/favicon.ico") {
      return handleHome(env, request);
    }

    return handleProxy(url, request, env);
  },
};

/**
 * 处理文件代理请求
 */
async function handleProxy(url, request, env) {
  // 1. 确定目标 GitHub Raw 地址
  let targetUrl = "https://raw.githubusercontent.com";

  // 简单的防滥用检查：如果 URL 中包含了 host，尝试提取路径
  // 这里的逻辑假设用户访问 worker.dev/some/file -> raw.github.../repo/branch/some/file
  if (env.GH_NAME && env.GH_REPO) {
    // 使用环境变量配置的仓库
    targetUrl += `/${env.GH_NAME}/${env.GH_REPO}`;
    if (env.GH_BRANCH) {
      targetUrl += `/${env.GH_BRANCH}`;
    }
    targetUrl += url.pathname;
  }
  else {
    // 如果没有配置环境变量，假设路径中包含了完整信息
    // 比如: worker.dev/User/Repo/Branch/File
    targetUrl += url.pathname;
  }

  // 2. 处理鉴权 Token
  const clientToken = url.searchParams.get("token");
  let githubToken = "";

  // 逻辑说明：
  // 情况 A: 设置了访问密码 (env.TOKEN) 和 内部GithubToken (env.GH_TOKEN)
  //        用户必须提供正确的密码 (?token=密码)，Worker 才会使用内部 GithubToken 去请求。
  // 情况 B: 未设置内部逻辑，直接使用用户传入的 Token 作为 Github Token。

  if (env.GH_TOKEN && env.TOKEN) {
    if (clientToken === env.TOKEN) {
      githubToken = env.GH_TOKEN; // 密码匹配，使用内部 Token
    }
    else {
      // 密码不对，回退尝试用用户传的做 token
      githubToken = clientToken;
    }
  }
  else {
    // 优先用环境变量，否则用 URL 参数
    githubToken = env.GH_TOKEN || env.TOKEN || clientToken;
  }

  if (!githubToken) {
    return new Response("Error: Token is required.", { status: 403 });
  }

  // 3. 构建并发送请求
  try {
    const headers = new Headers();
    headers.append("Authorization", `token ${githubToken}`);
    // 可以在这里添加 User-Agent 避免被 GitHub 拒绝
    headers.append("User-Agent", "Cloudflare-Worker-Proxy");

    const response = await fetch(targetUrl, { headers });

    if (response.ok) {
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    }

    const errorText = env.ERROR || `Failed to fetch: ${response.status} ${response.statusText}`;
    return new Response(errorText, { status: response.status });
  }
  catch (e) {
    return new Response(`Worker Error: ${e.message}`, { status: 500 });
  }
}

/**
 * 处理首页请求 (跳转或伪装)
 */
async function handleHome(env, request) {
  // 检查是否有重定向配置
  const redirectList = env.URL302 ? parseEnvList(env.URL302) : null;
  const proxyList = env.URL ? parseEnvList(env.URL) : null;

  if (redirectList && redirectList.length > 0) {
    const randomUrl = redirectList[Math.floor(Math.random() * redirectList.length)];
    return Response.redirect(randomUrl, 302);
  }

  if (proxyList && proxyList.length > 0) {
    const randomUrl = proxyList[Math.floor(Math.random() * proxyList.length)];
    return fetch(new Request(randomUrl, request));
  }

  // 默认返回 Nginx 伪装页
  return new Response(NGINX_HTML, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

/**
 * 工具：解析环境变量中的 URL 列表
 * 将空格、换行、引号、逗号分隔的字符串转换为数组
 */
function parseEnvList(envStr) {
  if (!envStr) {
    return [];
  }
  // 正则解释：匹配 [空格, 回车, 换行, 双引号, 单引号, 逗号] 中的任意一个或多个
  return envStr.split(/[\s"',;]+/).filter(item => item.length > 0);
}

// 静态资源：Nginx 伪装页面
const NGINX_HTML = `
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
  body { width: 35em; margin: 0 auto; font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and working. Further configuration is required.</p>
<p>For online documentation and support please refer to <a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at <a href="http://nginx.com/">nginx.com</a>.</p>
<p><em>Thank you for using nginx.</em></p>
</body>
</html>
`;
```

在“变量和机密”中添加以下环境变量

| 类型   | 名称      | 说明                                       |
| :----- | :-------- | ------------------------------------------ |
| 纯文本 | GH_BRANCH | 你的私有仓库的主分支名，一般为master或main |
| 纯文本 | GH_NAME   | 你的GitHub用户名                           |
| 纯文本 | GH_REPO   | 你的私有仓库名                             |
| 密钥   | GH_TOKEN  | 刚刚创建的GitHub Personal access token     |

![](https://image-bed.keke.cc/202512171553591.png)

在“域和路由”下添加自定义域，绑定你的自定义域名

![](https://image-bed.keke.cc/202512171554079.png)

## 使用PicGo上传图片至图床（可选）

在插件市场中搜索picgo-plugin-compress-next并安装

![](https://image-bed.keke.cc/20251217161028367.png)

在插件设置中配置TinyPNG API Key

![image-20251217161751791](https://image-bed.keke.cc/20251217161751941.png)

启用插件

![image-20251217162004500](https://image-bed.keke.cc/20251217162039972.png)

配置图床。其中 设定仓库名 为：你的用户名/私有仓库名；设定Token 为你前面申请的Personal access token。

![image-20251217162210077](https://image-bed.keke.cc/20251217162213490.png)

---

现在Cloudflare R2也提供免费的10GB对象存储空间，也可以用来做图床。不过目前这套流程既然已经构建起来了，就先用着吧
