const http = require('http')
const URL = require('url')
const fs = require('fs')
const querystring = require('querystring')

// cookie
function serverCallback(req, res) {
  const url = URL.parse(req.url)
  let filePath = './static/公章.png'
  if (url.pathname === '/file') {
    fs.stat(filePath, (err, stats) => {
      let readStream = fs.createReadStream(filePath)
      let arr = []
      readStream.on('open', function (fd) {
        console.log('开始读取文件');
      });
      readStream.on('data', function (data) {
        console.log('读取到数据：');
        console.log(data);
        arr.push(data)
      });
      readStream.on('end', function () {
        console.log('文件已全部读取完毕');
        let buffer = Buffer.concat(arr)
        res.setHeader('content-type', 'image/png')
        res.write(buffer)
        res.end()
      });
      readStream.on('close', function () {
        console.log('文件被关闭');
      });
      readStream.on('error', function (err) {
        console.log('读取文件失败');
      });
    })
  }
  else if(url.pathname === '/savelog'){
    let filePath= './static/log.txt'
    let log='\r\n log---'+Date.now().toLocaleString()
    fs.writeFile(filePath,log,{flag:"a"},err=>{
      if (err) {
      console.log(err)        
      } else {
        res.end('ok_'+log)
      }
    })
  }
}
http.createServer(serverCallback).listen(8080)