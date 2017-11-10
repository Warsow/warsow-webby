const http = require('http');
const fs = require('fs');

const APP_WS_PORT = process.env.APP_WS_PORT || 88;

const server = http.createServer(function (req, res) {
  if ( req.url == "/" )
    req.url = "/index.htm";

  fs.readFile('client'+req.url, function(err, data) {
    if ( err ) {
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});
server.listen(APP_WS_PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${APP_WS_PORT}/`);
});

//---------------------------------------

const WebSocketServer = require('./WebSocketServer')({
  httpServer: server,
  debug: true
});

/*const WarsowServer = require('./WarsowServer');

var test = new WarsowServer('udp4', '5.39.27.36', 44472);*/

//-----------------------------------------
