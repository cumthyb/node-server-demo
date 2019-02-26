var http = require('http')

let server = http.createServer();
server.on('connection', conn => {
  console.log('client connected')
})

server.on('request', (req, res) => {
  // console.log(req.headers)
  console.log('server receive request ,url: ', req.url)
  res.writeHead(200, { 'Content-type': 'text/plain;charset=utf-8'})
  res.write('request事件演示')
  res.end('end中也可以写消息')
})

server.on('close', () => {
  console.log('server closed')
})

server.on('error', e => {
  console.log(e)
  if (e.code == 'EADDRINUSE') {
    console.log('端口号已经被占用!');//3306
  }
})

server.listen(8080, () => {
  console.log('node server started at localhost:8080')
})


