---
title: pnpm lockfile 版本对照
---

# pnpm lockfile 版本对照

| **pnpm** **版本** | **Lockfile Version (`pnpm-lock.yaml`)** | **支持的** **Node.js** **版本范围** | **最终版本号** |
| ----------------- | --------------------------------------- | ----------------------------------- | -------------- |
| **v10**           | 9.0                                     | >= 18.12                            | 10.28.0        |
| **v9**            | 9.0                                     | >= 18.0                             | 9.15.9         |
| **v8**            | 6.0                                     | >= 16.14                            | 8.15.9         |
| **v7**            | 5.4                                     | >= 14.19                            | 7.33.7         |
| **v6**            | 5.3 / 5.4                               | >= 12.17                            | 6.35.1         |
| **v5**            | 5.1 - 5.2                               | >= 10                               | 5.18.11        |
| **v4**            | 5.0                                     | >= 8                                | 4.14.4         |
| **v3**            | 4                                       | >= 6                                | 3.8.1          |
| **v2**            | 3                                       | >= 4                                | 2.25.7         |
| **v1**            | 2                                       | >= 4                                | 1.43.1         |
| **v0**            | 1 (shrinkwrap)                          | >= 4                                | 0.75.0         |

<small><i>*由Gemini生成</i></small>

使用bash获取每个pnpm大版本对应的最后一个版本号：

::: code-group

```bash
npm view pnpm versions --json | grep -o '"[0-9]\+\.[0-9]\+\.[0-9]\+"' | tr -d '"' | awk -F. '{ major=$1; if (!latest[major] || $2*1000+$3 > latest_ver[major]) { latest[major]=$0; latest_ver[major]=$2*1000+$3 } } END { for (v in latest) print "v"v": "latest[v] }' | sort -V
```

:::

<small><i>*也是Gemini生成</i></small>
