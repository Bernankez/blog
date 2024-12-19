---
title: HTTP1.1与HTTP2
---

# HTTP1.1与HTTP2

## HTTP1

```
Request
GET / HTTP/1.0
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5)
Accept: */*

Response
HTTP/1.0 200 OK
Content-Type: text/plain
Content-Length: 137682
Expires: Thu, 05 Dec 1997 16:00:00 GMT
Last-Modified: Wed, 5 August 1996 15:55:28 GMT
Server: Apache 0.84

<html>
  <body>Hellow World</body>
</html>
```

以上为一个简单的HTTP请求。

由于HTTP1.x ResponseHeader必须为文本格式，而ResponseBody可以为任意格式，因此需要在Content-Type指明返回的是什么格式（MIME Type）。
RequestHeader中的Accept则指明了客户端可以接受什么格式。
由于ResponseBody可以是任意格式，因此可以数据压缩后再发送，Content-Encoding指明了数据压缩的方法。

```
Content-Encoding: gzip
Content-Encoding: compress
Content-Encoding: deflate
```

客户端请求时，也可指明自己接受哪些压缩方法

```
Accept-Encoding: gzip, deflate
```

### keep-alive长连接

HTTP1.1引入了长连接，即在一个TCP连接中可以发送多个请求。TCP连接默认不关闭，可以不用声明Connection: keep-alive

客户端或服务端发现对方一段时间没活动后就可以主动关闭连接。不过规范的做法是，客户端在最后一个请求时发送Connection: close，明确服务器关闭TCP连接。

HTTP1.1引入了管道机制（pipelining），同一个TCP连接中的**客户端**可以同时发送多个请求。以前需要先发送A请求，等待A请求返回再发送B请求，现在可以**同时发送**A和B请求，但是服务端还是会**依次返回**，先回应A，再回应B。

由于可以传回多个回应，因此需要一个字段区分数据包属于哪个回应，因此需要

```
Content-length: 3495
```

以上代码告诉浏览器本次回应长度为3495字节，之后的字节属于下个回应。

### 分块传输代码

但是HTTP1.1也可使用另一种传输方式：分块传输代码（chunked transfer encoding），避免耗时长的操作要等服务器所有操作完成才能发送。分块发送需要Header中有Transfer-Encoding字段。

```
Transfer-Encoding: chunked
```

在每个非空数据块前会有一个16进制值，表示该块长度。最后一个是大小为0的块，表示该请求回应完了。

即根据Content-length或长度为0的chunk可以划分消息边界。

虽然HTTP1.1有了长连接，但是所有请求依然是按次返回的，即B请求还是得等A请求返回了才能返回，假如A请求是个非常耗时的操作，会造成队头堵塞（Head-of-line blocking）

为了避免该问题，可以减少请求数，或同时多开持久连接（对于大多数浏览器，对于同一域名，允许同时建立6个持久连接）

## HTTP2

### 二进制头部与消息体

HTTP2第一个新特性是二进制协议。HTTP2的头部和数据体都是**二进制**，统称为帧（frame）

### 多路复用

同时HTTP2可以多路复用。客户端和服务端都可同时发送多个请求或回应，比如可以先回应A请求的一部分，接着回应B请求，最后回应A请求的剩下部分。

由于多路复用的特性，因此HTTP2需要对每个数据包做标记，标记它属于哪个回应（数据流），每个数据流有一个唯一id。协议规定，客户端发出的数据流id为奇数，服务端发出的数据流id为偶数。

### 取消数据流

同时HTTP2可以取消数据流。数据流发送一半时客户端和服务端都可以发送一个`RST-STREAM`帧，取消该数据流。而在HTTP1.1中取消数据流只能关闭TCP连接。同时客户端可以指定数据流优先级，服务器可以根据优先级决定回应顺序。

### 头部压缩

HTTP2引入了头信息压缩机制。一方面头信息使用`hpck`协议压缩。另一方面客户端和服务端都维护一张头信息表，对于相同Header字段只发送索引，不再发送重复字段，只发送更新了的字段。

### 服务端主动推送

HTTP2允许服务器主动推送，比如当客户端请求index.html时，服务端可以主动推送index.css，index.js。服务器会先发送`PUSH_PROMISE`帧，该帧只包含预推送资源的首部。如果客户端对此无意见，服务端就会发送DATA帧。客户端也可以拒绝推送。当客户端接收到这些文件时，当下次请求这些文件时就可以直接从缓存中读取。
