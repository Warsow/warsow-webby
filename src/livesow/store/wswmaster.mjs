import EventEmitter from 'events';
import {udpRequest, resolveDnsMultiple} from '../lib/udputils.mjs';

import {WswServer} from './wswserver.mjs';

import { createLogger } from '../../server/logger.mjs';
const logger = createLogger('WswMaster');

const IGNORE_UDP6 = true;

const OOB_PADDING = '\xFF\xFF\xFF\xFF';

const REQUEST_HEADER = {
  'udp4': OOB_PADDING + 'getservers',
  'udp6': OOB_PADDING + 'getserversExt',
};
const RESPONSE_HEADER = {
  'udp4': OOB_PADDING + 'getserversResponse',
  'udp6': OOB_PADDING + 'getserversExtResponse',
};
const TYPE_TOKEN = {
  'udp4': '\\',
  'udp6': '/',
};

export class WswMaster extends EventEmitter {
  constructor() {
    super();

    this.masterServers = [
      { host: 'dpmaster.deathmask.net', port: 27950 },
      { host: 'ghdigital.com', port: 27950 },
      { host: 'excalibur.nvg.ntnu.no', port: 27950 },
      { host: 'eu.master.warsow.gg', port: 27950 },
      { host: 'eu.master.warow.gg', port: 27950 },
    ];

    this.protocols = [
      '22',
    ];

    this.changes = new Set();

    this.dnsResolveServers();
  }

  dnsResolveServers() {
    resolveDnsMultiple(this.masterServers)
    .then( (res) => {
      this.masterServers = res
      this.sendRequests();
    });
  }
  
  sendRequests() {
    this.masterServers.forEach( (server) => {
      if (IGNORE_UDP6 && server.family == 'udp6') {
        return;
      }
      this.protocols.forEach( (protocol) => {
        this.sendRequest(server, protocol);
      });
    });
  }

  async sendRequest(server, protocol) {
    let msg = await udpRequest(
      server.family,
      server.host,
      server.port,
      Buffer.from(REQUEST_HEADER[server.family] + ' Warsow '+protocol+' empty full', 'ascii')
    );
    if ( !msg ) {
      return;
    }

    let index = RESPONSE_HEADER[server.family].length;
    while (index < msg.length) {
      const typeToken = msg.toString('ascii', index++, index);
      
      if ( msg.toString('ascii', index, index + 3) == "EOT" ) {
        break;
      }
      
      let ip = '';
      let family;
      if (typeToken === TYPE_TOKEN['udp4']) {
        family = 'udp4';
        ip = Array(4).fill().map(() => {
          const part = msg.readUInt8(index);
          index += 1;
          return part;
        }).join('.');
      }
      if (typeToken === TYPE_TOKEN['udp6']) {
        family = 'udp6';
        ip = Array(8).fill().map(() => {
          const part = msg.readUInt16BE(index).toString(16);
          index += 2;
          return part;
        }).join(':');
      }

      const port = msg.readUInt16BE(index);
      index += 2;

      this.emit('foundServer', {ip: ip, port: port});
      
      WswServer.getOrCreate(family, ip, port, (server) => {
        server.on('serverUpdate', (server) => {
          logger.log(`serverUpdate ${server}`);
        });
        server.on('serverDelete', (server) => {
          logger.log(`serverDelete ${server}`);
        });
        server.on('serverAdd', (server) => {
          logger.log(`serverAdd ${server}`);
        });
      });
    }
  }
}