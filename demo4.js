const http = require('http')
const URL = require('url')
const fs = require('fs')
const util = require('util');
const path=require('path')
const querystring = require('querystring')

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
  else if (url.pathname == '/uploadfile') {
    var chunks = []
    var size = 0;

    var formidable = require('formidable')
    var form = new formidable.IncomingForm();
    form.keepExtensions = false;
    form.uploadDir = "./static";
    form.parse(req, function (err, fields, files) {
      let oldpath = __dirname + '/' + files.data.path
      let newpath = __dirname + '/static/' + files.data.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          console.log("改名失败");
          throw Error(err);
        }
      });
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.write('received upload:\n\n');
      res.end(util.inspect({ fields: fields, files: files }));
    });

    return;

    req.on('data', chunk => {
      chunks.push(chunk)
      size += chunk.length;
    })
    req.on('end', () => {
      var file = Buffer.concat(chunks, size);
      console.log(file.toString())
      if (!size) {
        res.writeHead(404);
        res.end('');
        return;
      }
      var rems = [];

      //根据\r\n分离数据和报头
      for (var i = 0; i < file.length; i++) {
        var v = file[i];
        var v2 = file[i + 1];
        if (v == 13 && v2 == 10) {
          rems.push(i);
        }
      }

      //图片信息
      var picmsg_1 = file.slice(rems[0] + 2, rems[1]).toString();
      var filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];

      //图片数据
      var nbuf = file.slice(rems[3] + 2, rems[rems.length - 2]);
      var path = './static/' + filename;

      fs.writeFileSync(path, nbuf);
      console.log("保存" + filename + "成功");

      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
      res.end('<div id="path">' + path + '</div>');
    })
  }
  else if (url.pathname === '/savelog') {
    let filePath = './static/log.txt'
    let log = '\r\n log---' + Date.now().toLocaleString()
    fs.writeFile(filePath, log, { flag: "a" }, err => {
      if (err) {
        console.log(err)
      } else {
        res.end('ok_' + log)
      }
    })
  }

}
http.createServer(serverCallback).listen(8080)