var http = require('http')

/////////////////////////////////////////////////////////
// 默认statusCode为200
http.createServer((req, res) => {
  res.write('Hello Nodejs')
  res.end()
}).listen(8080)
