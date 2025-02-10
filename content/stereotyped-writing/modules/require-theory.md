---
title: require
---

# require

## 原理

```javascript
function require(path){
  // 导入文件
  eval(text)
}
```

## 查找规则

> [!TIP]
> [nodejs的require加载模块的路径搜索顺序说明](https://blog.csdn.net/ababab12345/article/details/124104779)

1. 模块有路径

   先根据路径查找模块，如果是完整路径，则直接导入
2. 模块没路径

   Node假设它是系统模块，去node_modules中找，如果没找到，则在父级node_modules中找，直到根目录，还没找到，到系统环境变量NODE_PATH目录中找，还没找到，去全局目录找（eg.C:\\Program Files\\nodejs\\lib\\node）
3. 如果模块没有后缀，先找同名js/json/node文件再找同名js文件夹

   先找同名文件夹下index.js

   如果没有，去找同名文件夹下package.json的main

   如果还是没有，报错

![](https://s2.loli.net/2023/03/15/W97uZGMvPHQrADo.png)
