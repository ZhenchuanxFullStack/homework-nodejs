var http = require('http');

http.createServer(function(request, response){
    console.log('文件11122')
}).listen(8087)

console.log('Server listen on 8087!')