/*
 * @Author: hongyongbo
 * @LastEditors: hongyongbo
 * @Description: 原生node演示mysql数据库CURD
 * @Notice: 
 * @Date: 2019-02-21 18:46:10
 * @LastEditTime: 2019-02-24 22:45:00
 */


const http = require('http')
const url = require('url')
const mysql = require('mysql')
const { registerRouter, findRouter } = require('./router.js')

const options = {
  port: 3456,
  host: '127.0.0.1'
}

const app = http.createServer();

const dbOptions = {
  host: 'cumthyb.site',
  port: 3306,
  user: 'root',
  password: 'Hyb2018.',
  database: 'test',
  connectTimeout: 5000
}

const pool = mysql.createPool(dbOptions);
pool.connectionLimit = 10;//连接池允许最大连接数10个
pool.waitForConnections = true;
pool.queueLimit = 0;

app.listen(options.port, options.host, () => {
  console.log(`server started at ${options.host}:${options.port}`)
})

app.on('error', err => {
  console.log(err)
})

app.on('request', requestCallbak)

app.on('close', msg => {
  if (pool) {
    pool.end(err => {
      console.log(err)
    })
  }
  console.log(msg)
})



/**
 * @parmas: 
 * @Description:注册路由
 */
registerRouter('post', '/register',  (query, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        res.writeCorsJson({
          msg: err,
          code: -1
        })
        return
      }
      let { name, pwd } = query;
      conn.query(`SELECT COUNT(id) AS count FROM user WHERE name = ? `, [name], (err, result, fields) => {
        if (result[0]['count'] > 0) {
          conn.release();
          res.writeCorsJson({
            msg: `用户${name}已存在`,
            code: -1
          })
        }
        else {
          conn.query('INSERT INTO user VALUES(?,?,?)', [(new Date()).getTime(), name, pwd], (err, result, fields) => {
            res.writeCorsJson({
              msg: `用户${name}创建成功`,
              code: 1
            })
            conn.release();
          })
        }
      })
    })
  } catch (error) {
    res.writeCorsJson({
      msg: error,
      code: -1
    })
  }
})

/**
 * @parmas: 
 * @Description:注册路由
 */
registerRouter('post', '/login',  (query, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        res.writeCorsJson({
          msg: err,
          code: -1
        })
        return
      }
      let { name, pwd } = query;
      //校验用户是否存在
      conn.query(`SELECT id FROM user WHERE name = ? AND pwd = ?`, [name, pwd], (err, result, fields) => {
        if (!result[0]) {
          conn.release();
          res.writeCorsJson({
            msg: `用户${name}信息输入有误`,
            code: -1
          })
        }
        else {
          //写入用户登陆日志
          conn.query('INSERT INTO logs(id,logintime) VALUES((SELECT id FROM user WHERE name = ? AND pwd = ?),?)', [name, pwd, new Date()], (err, result, fields) => {
            res.writeCorsJson({
              msg: `用户${name}登陆成功`,
              code: 1
            })
          })
        }
      })
    })
  } catch (error) {
    res.writeCorsJson({
      msg: error,
      code: -1
    })
  }
})

/**
 * @parmas: 
 * @Description:注册路由
 */
registerRouter('get', '/logs',  (query, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        res.writeCorsJson({
          msg: err,
          code: -1
        })
        return
      }
      let { name, pwd } = query;
      //校验用户是否存在
      conn.query(`SELECT id FROM user WHERE name = ?`, [name], (err, result, fields) => {
        if (result[0]['id'] === 0) {
          conn.release();
          res.writeCorsJson({
            msg: `用户${name}不存在`,
            code: -1
          })
        }
        else {
          //写入用户登陆日志
          conn.query('SELECT l.* FROM user u,logs l WHERE  u.name=? AND u.id=l.id', [name], (err, result, fields) => {
            res.writeCorsJson({
              msg: `用户${name}登陆成功`,
              code: 1,
              data: result
            })
          })
        }
      })
    })
  } catch (error) {
    res.writeCorsJson({
      msg: error,
      code: -1
    })
  }
})


/**
 *
 * 服务响应方法
 * @param {*} req
 * @param {*} res
 */
function requestCallbak(req, res) {
  res.writeCorsJson = (json) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(json))
  }

  let { pathname, query } = url.parse(req.url, true)
  let method = req.method.toUpperCase()

  var cb;
  if (method != 'OPTIONS') {
    cb = findRouter(method, pathname)
    if (!cb) {
      res.statusCode = 404
      res.writeCorsJson({
        msg: 'NOT FOUND',
        code: -1
      })
      return
    }
  }

  if (method === 'POST') {
    let chunks = []
    let size = 0
    req.on('data', chunk => {
      chunks.push(chunk)
      size += chunk.length;
    })
    req.on('end', () => {
      try {
        if (!size) {
          res.end('参数缺失')
          return
        }
        let query = JSON.parse(Buffer.concat(chunks).toString())
        cb(query, res)
      } catch (error) {
        res.statusCode = 500
        res.writeCorsJson({
          msg: '服务开小差了',
          code: -1
        })
      }
    })
  }
  else if (method === 'GET') {
    try {
      cb(query, res)
    } catch (error) {
      res.writeCorsJson({
        msg: '服务开小差了',
        code: -1
      })
    }
  }
  else if (method === 'OPTIONS') { //设置允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'put,post')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader('Access-Control-Max-Age', '10')
    res.writeHead(200)
    res.end()
  }
}