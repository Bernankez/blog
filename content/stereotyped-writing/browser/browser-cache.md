---
title: 浏览器缓存
---

# 浏览器缓存 <Badge type="info" text="BLOOMCHIC" />

## 强制缓存与协商缓存

**强制缓存**从浏览器缓存查找结果，根据返回的缓存规则决定是否使用该缓存。

**协商缓存**当强制缓存失效后，浏览器携带缓存标识向服务器请求， 由服务器决定是否使用缓存。

即强制缓存不请求服务器，协商缓存会先去问服务器。强制缓存存在memory cache/disk cache，返回200.协商缓存返304.

> [!TIP]
> js 字体 图片会进入memory cache；css文件会进入disk cache。因为css加载一次后不会频繁读取。

决定是否缓存的字段：**缓存控制**（要不要缓存，如何缓存）、**缓存校验**（缓存是否是最新的，缓存是否有效）

## 缓存控制

Pragma > Cache Control > Expires

### Pragma/Expires

Pragma为http1.0通用首部。Pragma为no-cache时，表示禁用缓存。Pragma唯一指令只能是no-cache，与cache-control: no-cache效果一致。

Expires是GMT时间，表示缓存有效时间。Expires是绝对时间点。如果客户端和服务端因为某些原因时区不同，时间不准确）时间发生误差，则**强制缓存会失效**。

### Cache-Control

**RequestHeader**中

| 字段                      | 含义                                                                        |
| ------------------------- | --------------------------------------------------------------------------- |
| no-cache                  | 告知（代理）服务器不直接使用缓存，要求向原服务器发起请求                    |
| no-store                  | 所有内容不会被保存到缓存或Internet临时文件中                                |
| max-age=delta-seconds     | 告知服务器 客户端希望接受一个存在时间不大于delta-seconds秒的资源            |
| max-stale[=delta-seconds] | 告知服务器 客户端愿意接收一个超过（任意/delta-seconds秒）缓存时间的资源     |
| min-fresh=delta-seconds   | 告知服务器 客户端希望接收一个小于delta-seconds秒内被更新过的资源            |
| no-transform              | 告知服务器 客户端希望获取实体数据没有被转化（比如压缩）过的资源             |
| only-if-cached            | 告知（代理）服务器 客户端希望获取缓存的内容（如果有），不用向原服务器发请求 |
| cache-extension           | 自定义扩展值，服务器不识别则被忽略                                          |

**ResponseHeader**中

| 字段                   | 含义                                                                                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| public                 | 任何情况下都要缓存该资源（即使是需要http认证的资源）                                                                                                              |
| Private[="field-name"] | 表明返回报文中全部或部分（若制定了field-name则为field-name的字段数据）仅开放给某些用户（服务器指定的share-use，如代理服务器）做缓存使用，其他用户不能缓存这些数据 |
| no-cache               | 不直接使用缓存，要求向服务器发起（新鲜度校验）请求                                                                                                                |
| no-store               | 所有内容不会被缓存或Internet临时文件中                                                                                                                            |
| no-transform           | 告知客户端缓存文件时不得对实体数据做任何改变（如压缩）                                                                                                            |
| only-if-cached         | 告知（代理） 服务器 客户端希望获取缓存的内容（如果有）而不用向原服务器发起请求                                                                                    |
| must-revalidate        | 当前资源一定是向原服务器发起验证请求，请求失败返回504（而非代理服务器缓存）                                                                                       |
| proxy-revalidate       | 与must-revalidate类似，但仅能用于共享缓存（如代理）                                                                                                               |
| max-age=delta-seconds  | 告知客户端 资源在delta-seconds秒内无需重复向服务器发请求                                                                                                          |
| s-maxage=delta-seconds | 同max-age，但仅应用于共享缓存（如代理）                                                                                                                           |
| cache-extension        |                                                                                                                                                                   |

no-store优先级最高。每次no-store都重新向服务器发请求。

## 缓存校验

> HTTP1.1引入新的缓存校验字段

### Last-Modified

服务器返回`Last-Modified`，客户端下次请求时通过`If-Modified-Since`或`If-Unmodified-Since`字段带上服务器返回的`Last-Modified`，服务器检查该时间与最后修改时间。如果一致，返回304；不一致则返回200和资源，并带上新的`Last-Modified`。

> [!TIP]
> If-Modified-Since：如果时间一致，返回304；不一致则返回资源
>
> If-Unmodified-Since：如果时间不一致，返回412

### ETag

可能存在最后修改时间变了但内容没变的情况，因此需要etag。

服务器通过某个算法对资源计算，将该值通过etag返回给客户端。客户端下次请求时通过`If-None-Match`或`If-Match`带上etag，服务器比对校验。

> [!TIP]
> If-None-Match：如果文件一致，返回304；不一致则返回资源
>
> If-Match：如果不一致，返回412

## 总结

### 200(from cache)（强制缓存）

expires/cache-control控制

expires(http 1.0)是绝对时间；cache-control(http 1.1)是相对时间。只要缓存没失效，浏览器只访问自己的缓存

### 304（协商缓存）

last-modified/etag控制

服务器检查文件是否修改过，返回304或修改后的文件

### 200

以上两层全失效，或没本地缓存，则请求到服务器

### Cache-Control各值关系

![](https://image-bed.keke.cc/202504291430111.png)
