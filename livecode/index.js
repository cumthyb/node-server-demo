const http = require('http')
const url=require('url')
const mysql=require('mysql')

http.createServer((req,res)=>{
  let { pathname, query } = url.parse(req.url, true)
  switch (pathname) {
    case '/insert':
      sInsert(query, res)
      break;
    }

}).listen(8080)

let options={
  host: 'cumthyb.site',
  port: 3306,
  user: 'root',
  password: 'Hyb2018.',
  database: 'test',
  connectTimeout: 5000
}

const conn = mysql.createConnection(options)

conn.connect();
conn.on('err',)

function sInsert(query,res) {
  conn.query('insert into user values(? ,?,?)',[(new Date()).getTime(),query.name,query.pwd],(err,result,fields)=>{
    if (!err) {
      res.end('success')
    } else {
      res.end('faild')
    }
  })
}