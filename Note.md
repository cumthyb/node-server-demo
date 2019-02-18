# Node.js

## 1 简介
- 用来写服务器的
- javascript 的后台版本
- 用途
  - 中间层 (安全,性能缓存,降低主服务器复杂度)
  - 小型服务
  - 工具开发(webpack,gulp)

- 环境搭建 [官网](https://nodejs.org/en/)
- NPM node package manager


## http模块

- createServer
```
http.createServer(
  ()=>{

  }
)

```

- listen

  - 监听：等待客户端的连接
  - 端口：区别不同的服务

- response
  - response.setHeader(name, value)
  - response.writeHead(statusCode[, statusMessage][, headers])
  - response.end([data][, encoding][, callback])


## http报文
- 结构
  - header
  - body

- 状态码
  - 1xx 信息
  - 2xx 成功
  - 3xx 重定向
  - 4xx 请求错误
  - 5xx 服务器错误

- 请求方式

  - get
  - post
    - on('data') buffer
    - end('end')


