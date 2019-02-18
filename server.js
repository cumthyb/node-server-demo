const http = require('http')
const util = require('util')
const URL = require('url')
const querystring=require('querystring')

http.createServer(function (req, res) {
  console.log('url',req.url)
  if (req.url==='/favicon.ico') {
    res.end();
    return
  }
  if (req.method.toUpperCase() === 'POST') {
    // 定义了一个post变量，用于暂存请求体的信息
    var post = '';
    let arr=[]
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function (chunk) {
      arr.push(chunk)
    });

    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function () {
      let buffer=Buffer.concat(arr)
      let query=querystring.parse(buffer.toString())

      res.end(buffer.toString())
    });
  } else if (req.method.toUpperCase() === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Trailer': 'Content-MD5'
    });
    let url = URL.parse(req.url,true)
    console.log(url.query)
    res.write(url.query);
    res.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
    res.end();
  }

}).listen({
  host: 'localhost',
  port: 8888,
  exclusive: true
}, () => {
  console.log('node server started at localhost:8888')
});