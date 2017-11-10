const ws = require('ws');

class WebSocketServer {

  constructor(params) {
    if ( !params.httpServer )
      return;

    this.debug = params.debug || false;

    this.wss = new ws.Server({server: params.httpServer});

    this.wss.on('connection', (ws, req) => {
      if ( this.debug )
        console.log('wss: ' + req.connection.remoteAddress + ' connected.');

      ws.on('message', (msg) => {
        if ( this.debug )
          console.info('wss: ' + req.connection.remoteAddress + ' msg: ' + msg + '.');

        /*this.wss.clients.forEach( (client) => {
          client.send("hello.");
        })*/
        this.parseMsg(ws, msg);

      })
    })

    this.MasterServer = require('./MasterServer')({
      wss: this,
      servers: [
        'dpmaster.deathmask.net',
        'ghdigital.com',
        'excalibur.nvg.ntnu.no',
        'eu.master.warsow.gg'
      ],
      versions: [10, 11, 12, 15, 20, 21, 22],
      port: 27950,
      debug: false
    });

    this.loop = setInterval(() => this.sendUpdates(), 1000);
  }

  // unused atm
  initialize(client) {
    //send initial server listing
    client.send(JSON.stringify({
      op:'init',
      data:this.MasterServer.generateInitData(client)
    }));
  }

  // call this every second?
  sendUpdates() {
    this.MasterServer.prepareUpdates();

    this.wss.clients.forEach( (client) => {
      // TODO: skip un-initialized clients (no filters received)
      client.send(JSON.stringify({
        op:'update',
        data:this.MasterServer.generateUpdates(client)
      }));
    });
  }

  parseMsg(client, msg) {
    try {
      var payload = JSON.parse(msg);
    } catch(e) {
      console.log('wss: error parsing json message:', e);
      // TODO: should maybe disconnect this client?
      return;
    }

    switch ( payload.op )
    {
      case 'filters':
      {
        // this starts the whole cycle
        client.send(JSON.stringify({
          op:'init',
          data:this.MasterServer.generateInitData(client)
        }));
      } break;
      default:
      {
        client.send(JSON.stringify({
          op:'error',
          data:"invalid op"
        }));
      }
    }
  }

}

module.exports = (params) => new WebSocketServer(params);
