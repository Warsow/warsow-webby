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

const WebSocketServer = require('websocket').server;
const wss = new WebSocketServer({httpServer: server, autoAcceptConnections: false});

const MasterServer = require('./MasterServer')({
  servers: [
    'dpmaster.deathmask.net',
    'ghdigital.com',
    'excalibur.nvg.ntnu.no',
    'eu.master.warsow.gg'
  ],
  versions: [10, 11, 12, 15, 20, 21, 22],
  port: 27950,
  debug: true
});

const WarsowServer = require('./WarsowServer');

/*var test = new WarsowServer('udp4', '213.202.239.206', 44402);
test.update();*/

var clients = [];
wss.on('request', function(request)
{
  if ( request.requestedProtocols.indexOf('livesow') === -1 )
  {
    console.log('wss: connecting client ' + request.remoteAddress + ' rejected.');
    request.reject(404, 'invalid protocol');
    return;
  }

  var client = request.accept('livesow', request.origin);
  clients.push(client);
  console.log('wss: ' + client.remoteAddress + ' connected.');

  client.on('close', function()
  {
    console.log('wss: ' + client.remoteAddress + ' disconnected.');
  })

  client.on('message', function(msg, rinfo)
  {
    console.info('wss: ' + client.remoteAddress + ' msg:' + msg.utf8Data + '.');
    client.send("hello\n");
  });
});
console.log('WebSocketServer running at http://127.0.0.1:88/');

//-----------------------------------------
