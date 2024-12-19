---
title: Webpack Loader
---

# Webpack Loader

webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: 'style-loader' },
          // [css-loader](/loaders/css-loader)
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```

loader可通过配置方式/内联方式配置，推荐配置方式。

> [!TIP]
> loader执行顺序：
>
> rules中从前往后执行，同一`use`中，从后往前执行，并且前一loader的输出会作为后一loader的输入。上面的配置执行顺序为：`sass-loader`,`css-loader`,`style-loader`。
