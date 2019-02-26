const http = require('http')
const url = require('url')
const mysql = require('mysql')
const util = require('util');

http.createServer(function (req, res) {

  let { pathname, query } = url.parse(req.url, true)

  switch (pathname) {
    case '/insert':
      sInsert(query, res)
      break;
    case '/delete':
      sDelete(query, res)
      break;
    case '/update':
      sUpdate(query, res)
      break;
    case '/select':
      sSelect(query, res)
      break;
    default:
      res.statusCode = 404
      res.end()
      break;
  }

}).listen({
  host: 'localhost',
  port: 8080
}, () => {
  console.log('node server started at localhost:8080')
});

const dbOptions = {
  host: 'cumthyb.site',
  port: 3306,
  user: 'root',
  password: 'Hyb2018.',
  database: 'test',
  connectTimeout: 5000
}
const conn = mysql.createConnection(dbOptions)

conn.connect();


function sInsert(query, res) {
  conn.query('insert into user values(?,?,?)', [(new Date()).getTime, query.name, query.pwd], (err, result, fields) => {
    if (err) {
      res.end(err.message)
    }
    else {
      res.end('insert 成功')
    }
  })
}

function sDelete(query, res) {
  conn.query('delete from user where name=?', [query.name], (err, result, fields) => {
    if (err) {
      res.end(err.message)
    }
    else {
      res.end('delete 成功')
    }
  })
}

function sUpdate(query, res) {
  conn.query('update user set name=?,pwd=? where id=?', [query.name,query.pwd,query.id], (err, result, fields) => {
    if (err) {
      res.end(err.message)
    }
    else {
      res.end('update 成功')
    }
  })
}

function sSelect(query, res) {
  conn.query('select * from  user where name=?', [query.name], (err, result, fields) => {
    if (err) {
      res.end(err.message)
    }
    else {
      res.end(util.inspect(result));
    }
  })
}


