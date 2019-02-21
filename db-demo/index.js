const http=require('http')
const url=require('url')
const qs=require('qstring')
const fs=require('fs')
const mysql=require('mysql')

const options={
  port:3456,
  host:'127.0.0.1'
}

const app=http.createServer();

const dbOptions={
  host: '127.0.0.0',
  user: 'root',
  password: 'Hyb2018.',
  database: 'test',
  connectTimeout: 5000
}

const pool = mysql.createPool(dbOptions);
pool.connectionLimit = 10;//连接池允许最大连接数10个
pool.waitForConnections = true;
pool.queueLimit = 0;

app.listen(options.port,options.host,()=>{
  console.log(`server started at ${options.host}:${options.port}`)
})

app.on('error',err=>{
  console.log(err)
})

app.on('request',requestCallbak)

app.on('close',msg=>{
  console.log(msg)
})


function requestCallbak(req,res){

}


db

