var http = require('http')
var querystring = require('querystring')

/////////////////////////////////////////////////////////

// // 处理 get 请求
// function serverCallback(req, res) {
//   console.log(req.headers)
//   res.writeHead(200, {'Content-type': 'text/plain'})
//   res.write('hello nodejs demo1-get')
//   res.end()
// }
// http.createServer(serverCallback).listen(8080)



////////////////////////////////////////////////////////

// let server = http.createServer();
// server.on('connection', conn => {
//   // console.log(conn)
//   console.log('client connected')
// })

// server.on('request', (req, res) => {
//   // console.log(req.headers)
//   console.log('server receive request ,url: ',req.url)

//   res.writeHead(200, { 'Content-type': 'text/html' })
//   res.write('hello nodejs demo1-get')
//   res.end()
// })

// server.on('close', () => {
//   console.log('server closed')
// })

// server.on('error', e => {
//   if (e.code == 'EADDRINUSE') {
//     console.log('端口号已经被占用!');
//   }
// })

// server.listen(8080, () => {
//   console.log('node server started at localhost:8080')
// })


////////////////////////////////////////////////////////


// // 处理 post 请求 ，form 提交
// function serverCallback(req, res) {
//     var method = req.method.toLowerCase()
//     if (method === 'get') {
//         res.writeHead(200, {'Content-type': 'text/html'})
//         res.write('hello nodejs form-demo1-get')
//         res.end()
//     }
//     if (method === 'post') {
//         var data = ''
//         req.on('data', function (chunk) {
//             data += chunk.toString()
//         })
//         req.on('end', function () {
//             // res.writeHead(200, {'Content-type': 'text/html'})
//             // res.write(data)
//             data = querystring.parse(data)
//             res.writeHead(200, {'Content-type': 'application/json'})
//             res.write(JSON.stringify(data))
//             res.end()
//         })
//     }

// }
// http.createServer(serverCallback).listen(8080)



//////////////////////////////////////////////////////////////////////

// 处理 post 请求，json 格式
function serverCallback(req, res) {
  var method = req.method.toLowerCase()
  var contentType = req.headers['content-type']
  if (method === 'post') {
      if (contentType === 'application/x-www-form-urlencoded') {
          var data = ''
          req.on('data', function (chunk) {
              data += chunk.toString()
          })
          req.on('end', function () {
              data = querystring.parse(data)
              res.setHeader('Access-Control-Allow-Origin','*')
              res.writeHead(200, {'Content-type': 'application/json'})
              res.write(JSON.stringify(data))
              res.end()
          })
      }
      else if (contentType === 'application/json') {        
          const arr=[]
          req.on('data', function (chunk) {
            arr.push(chunk)
          })
          req.on('end', function () {
              let buffer=Buffer.concat(arr)
              res.setHeader('Access-Control-Allow-Origin','*')
              res.writeHead(200, {'Content-type': 'text/plain'})
              res.write(buffer.toString())
              res.end()
          })
      }
      else if (contentType.startsWith('multipart/form-data;')) {
        const arr=[]
        req.on('data', function (chunk) {
          arr.push(chunk)
        })
        req.on('end', function () {
            let buffer=Buffer.concat(arr)
            res.setHeader('Access-Control-Allow-Origin','*')
            res.writeHead(200, {'Content-type': 'text/plain'})
            res.write(buffer.toString())
            res.end()
        })
    }
  }
  else if(method === 'options'){
    //https://www.w3.org/TR/cors/#resource-preflight-requests
    res.setHeader('Access-Control-Allow-Origin','*')//必选
    res.setHeader('Access-Control-Allow-Methods','put,post')//必选
    res.setHeader('Access-Control-Allow-Headers','content-type')//告诉浏览器我(服务器)要求你必带的请求头
    res.setHeader('Access-Control-Max-Age','10')//告诉浏览器max-age(单位：秒)时间内，你不必再发预检请求了，朕准了！
    res.writeHead(200)
    res.end()
  }

}
http.createServer(serverCallback).listen(8080)