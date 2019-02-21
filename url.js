let url = require('url');
let u = 'http://member.krspace.cn:8080/abc/index.html?a=1&b=2#hash';

// 可以将查询字符串转化成对象
let urlObj = url.parse(u);
// let urlObj = url.parse(u,true);
console.log(urlObj.query); // 查询字符串
console.log(urlObj.pathname); //路径
