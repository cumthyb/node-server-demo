var http = require('http')
var querystring = require('querystring')

// cookie
function serverCallback(req, res) {
    console.log(req.url)
    res.setHeader('Set-Cookie', ['cookie1=ninja;Max-Age=10;httponly', 'cookie2=javascript']);
    res.statusCode=401
    res.statusMessage='ni ge si gui'
    res.end('401')
}
http.createServer(serverCallback).listen(8080)