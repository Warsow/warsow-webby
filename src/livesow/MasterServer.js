const dgram = require('dgram');
const WarsowServer = require('./WarsowServer');

class MasterServer {

  constructor(params) {
    this.wss = params.wss;
    this.debug = params.debug || false;

    this.masterservers = params.servers || ['dpmaster.deathmask.net']; // TODO: should parse & validate these..
    this.port = params.port || 27950;

    this.updateMessages = [];
    if ( params.versions ) {
      for ( var i = 0; i < params.versions.length; i++ ) {
        this.updateMessages.push(
          new Buffer('\xFF\xFF\xFF\xFFgetserversExt Warsow ' + params.versions[i] + ' ipv4 ipv6 empty full', 'ascii')
        );
      }
    } else {
      this.updateMessages = [new Buffer('\xFF\xFF\xFF\xFFgetserversExt Warsow 22 ipv4 ipv6 empty full', 'ascii')];
    }

    this.nextRequest = 0;
    this.setNextRequest(0);

    this.servers = [];
    this.updates = [];

    this.loop = setInterval(() => this.update(), 100); // temporary, should be lower
    this.update();

    if ( this.debug )
      console.log('Master Server', this);
  }

  // sets the timestamp for when to update next.
  setNextRequest(nextRequest) {
    this.nextRequest = (new Date()).getTime() + nextRequest;
  }

// sends all update messages to all masterservers and parses servers.
  update() {
    // update warsow servers
    if ( this.servers.length > 0 ) {
      this.servers.forEach((server) => {
        server.update();
      })
      //clearInterval(this.loop); // temporary, test
    }


    if ( (new Date()).getTime() < this.nextRequest )
      return;

    if ( this.debug )
      console.log('MS: update');

    // loop over masterservers
    this.masterservers.forEach((masterserver) => {
      if ( this.debug )
        console.log('MS: requesting updates for', masterserver);

      // loop over messages
      this.updateMessages.forEach((updatemsg) => {
        var client = dgram.createSocket('udp4');

        client.on('message', (message, remote) => {
          if ( this.debug )
            console.log('MS: MasterServer response from ' + remote.address + ':' + remote.port);
          client.close();

          // *
          // process server ips
          // *

          // chop off the header.
          var header = '1234getserversExtResponse';
          message = message.slice(header.length);

          // loop over message.
          var index = 0;
          while ( index < message.length ) {
            // get ip type
            var literal_type = message.toString('ascii', index++, index );
            var type;

            if ( literal_type == '\\' )
              type = 'udp4';
            if ( literal_type == '/' )
              type = 'udp6';
            // TODO: what if it's something else? rip

            // check if end of message
            if ( message.toString('ascii', index, index + 3) == "EOT" )
              break;

            // parse ip
            var ip = '';
            if ( type == 'udp4' )
            {
              ip += message.readUInt8(index) + '.'; index++;
              ip += message.readUInt8(index) + '.'; index++;
              ip += message.readUInt8(index) + '.'; index++;
              ip += message.readUInt8(index);       index++;
            }
            else if ( type == 'udp6' ) // ipv6
            {
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16) + ':'; index+=2;
              ip += message.readUInt16BE(index).toString(16);       index+=2;
            }

            // parse port
            var port = message.readUInt16BE(index); index+=2;

            if ( this.debug )
              console.log('MS: got server ip: ' + ip + ', port: ' + port);

            // check if already in serverlist
            var server_id = -1;
            for ( var s in this.servers )
            {
              if ( this.servers[s].type == type && this.servers[s].ip == ip && this.servers[s].port == port)
                server_id = s;
            }

            // create new wsw server
            if ( server_id == -1 )
            {
              var server = new WarsowServer(type, ip, port);
              this.servers.push(server);
            }
          }
        });

        client.send(updatemsg, 0, updatemsg.length, this.port, masterserver, function(err, bytes) {
          //client.close();
          // TODO: can this fail? afaik udp never fails to send. (maybe if address is faulty)
        });
      });
    });

    this.setNextRequest(60000); // 1 minute
  }

  generateInitData(client) {
    // TODO: match against client's filters.

    var list = [];
    this.servers.forEach( (server) => {
      if ( server.info != {} )
        list.push(server.info);
    });

    return list;
  }

  prepareUpdates() {
    this.updates = [];
    this.servers.forEach( (server) => {
      this.updates.push(server.getUpdates());
    });
  }

  generateUpdates(client) {
    // TODO: match against client's filters.

    var list = [];
    this.updates.forEach( (update) => {
      list.push(update);
    });

    return list;
  }

}

module.exports = (params) => new MasterServer(params);
