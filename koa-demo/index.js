const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql')
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser')

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

const app = new Koa();
const router = new Router();


let query = function (sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

router.post('/register', async (ctx, next) => {
  try {
    let { name, pwd } = ctx.request.body;
    let result = await query('SELECT COUNT(id) AS count FROM user WHERE name = ?', [name])

    if (result[0]['count'] > 0) {
      ctx.body = {
        msg: `用户${name}已存在`,
        code: -1
      }
    }
    else {
      await query('INSERT INTO user VALUES(?,?,?)', [(new Date()).getTime(), name, pwd])
      ctx.body = {
        msg: `用户${name}创建成功`,
        code: 1
      }
    }
  } catch (error) {
    ctx.body = {
      code: -1,
      msg: error
    }
  }
})

router.post('/login', async (ctx, next) => {
  try {
    let { name, pwd } = ctx.request.body;
    let result = await query('SELECT id FROM user WHERE name = ? AND pwd = ?', [name, pwd])

    if (!result[0]) {
      ctx.body = {
        msg: `用户${name}信息输入有误`,
        code: -1
      }
    }
    else {
      await query('INSERT INTO logs(id,logintime) VALUES((SELECT id FROM user WHERE name = ? AND pwd = ?),?)', [name, pwd, new Date()])
      ctx.body = {
        msg: `用户${name}登陆成功`,
        code: 1
      }
    }
  } catch (error) {
    ctx.body = {
      code: -1,
      msg: error
    }
  }
})

router.get('/logs', async (ctx, next) => {
  try {
    let { name, pwd } = ctx.request.query;
    let result = await query('SELECT id FROM user WHERE name = ?', [name])

    if (result[0]['id'] === 0) {
      ctx.body = {
        code: -1,
        msg: `用户${name}不存在`,
      }
    }
    else {
      let logs = await query('SELECT l.* FROM user u,logs l WHERE  u.name=? AND u.id=l.id', [name])
      ctx.body = {
        msg: `用户${name}登陆成功`,
        code: 1,
        data: logs
      }
    }
  } catch (error) {
    ctx.body = {
      code: -1,
      msg: error
    }
  }
})


app
  .use(cors({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': ['get', 'post'],
    'Access-Control-Allow-Headers': ['content-type']
  }))//跨域配置
  .use(bodyParser())//进行requestbody解析
  .use(router.routes())// 加入路由
  .use(router.allowedMethods());
/*
 * router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
 * 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
 * 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头 
 *
 */

app.listen(3456);