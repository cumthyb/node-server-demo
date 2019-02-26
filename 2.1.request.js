var http = require('http')
const util = require('util');

//////////////////////////////////////////////////////////////////////

// 演示get、post请求相应
function serverCallback(req, res) {
  var method = req.method.toLowerCase()
  var contentType = req.headers['content-type']
  if (method === 'get') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('content-type','application/json')
    let reqStr=util.inspect(req,false)
    res.write(reqStr)
    // res.write(JSON.stringify({
    //   url:req.url,
    //   headers:req.headers,
    //   method:req.method
    // }))
    res.end()
  }
  if (method === 'post') {
    if (contentType === 'application/json') {
      const arr = []
      req.on('data', function (chunk) {
        arr.push(chunk)
      })
      req.on('end', function () {
        let buffer = Buffer.concat(arr)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.writeHead(200, { 'Content-type': 'text/plain' })
        res.write(buffer.toString())
        res.end()
      })
    }
  }
  else if (method === 'options') {
    //https://www.w3.org/TR/cors/#resource-preflight-requests
    res.setHeader('Access-Control-Allow-Origin', '*')//必选
    res.setHeader('Access-Control-Allow-Methods', 'put,post')//必选
    res.setHeader('Access-Control-Allow-Headers', 'content-type')//告诉浏览器我(服务器)要求你必带的请求头
    res.setHeader('Access-Control-Max-Age', '10')//告诉浏览器max-age(单位：秒)时间内，你不必再发预检请求了，朕准了！
    res.writeHead(200)
    res.end()
  }

}
http.createServer(serverCallback).listen(8080)