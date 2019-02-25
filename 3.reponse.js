var http = require('http')
var querystring = require('querystring')

// cookie
function serverCallback(req, res) {
    console.log(req.url)
    // res.setHeader('Set-Cookie', ['type=ninja;Max-Age=10;httponly', 'language=javascript']);
    // res.writeHead(200, {
    //     'Content-type': 'text/html',
    //     // 'Set-Cookie': ['a=100', 'b=200']
    // })
    // res.write('hello nodejs')
    res.statusCode=404
    res.statusMessage='not found not found not found'
    res.end('404了')
}
http.createServer(serverCallback).listen(8080)