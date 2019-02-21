const http = require('http')
const url=require('url')
const querystring = require('querystring')

http.createServer((req,res)=>{
  console.log(req)
  let urlObj=url.parse(req.url)
  if (urlObj.pathname==='/upload') {
    let arr=[]
    req.on('data',chunk=>{
      arr.push(chunk)
    })
    req.on('end',()=>{
      let buffer=Buffer.concat(arr)
      res.end(buffer.toString()+'/n 你个死鬼'+ (new Date()).toTimeString())
    })
  }
}).listen(8888,'10.19.8.142')