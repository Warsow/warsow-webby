import LZString from 'lz-string';
import {createUuid} from './lib/uuid.mjs';
import {WswMaster} from './store/wswmaster.mjs';
import {WswServer} from './store/wswserver.mjs';
import {WswPlayer} from './store/wswplayer.mjs';
import {udpRequest, resolveDnsMultiple} from './lib/udputils.mjs';
import {Action} from './store/eventlog.mjs';

import { createLogger } from '../server/logger.mjs';
const logger = createLogger('Livesow');

const APP_WS_PORT = process.env.APP_WS_PORT || 88;

const clients = new Set();

/*
* Client
*/

class Client {
  constructor(ws) {
    this.id = createUuid();
    this.ws = ws;
    this.ready = false;
    this.lzString = false;
    this.initialized = false;
    this.timeOffset = 0;

    this.lastAction;
  }

  toString() {
    return `[${this.id.substr(0, 7)}]`;
  }

  sendMessage(type, payload) {
    const time = Date.now() + this.timeOffset;
    const msg = JSON.stringify({type, payload, time})
    if (this.lzString) {
      this.ws.send(LZString.compressToBase64(msg));
    } else {
      this.ws.send(msg);
    }
  }

  static create(ws) {
    const client = new Client(ws);
    clients.add(client);
    return client;
  }

  static delete(client) {
    clients.delete(client);
  }
}

/*
* Connections
*/

export function acceptConnection(ws) {
  const client = Client.create(ws);
  logger.log(`Client ${client} connected | ${clients.size} connected`);
  ws.on('message', (msgStr) => {
    let msg;
    try {
      msg = JSON.parse(msgStr);
    } catch (e) {
      logger.log(`Faulty message from ${client}`);
      //ws.close();
      return;
    }
    const res = handleMessage(client, msg);
    if (res) {
      client.send(res);
    }
  });
  ws.on('close', () => {
    Client.delete(client);
    logger.log(`Client ${client} disconnected | ${clients.size} connected`);
  })
}

function handleMessage(client, msg) {
  const { type, payload, time } = msg;
  if (type === 'READY') {
    logger.log(`Client ${client} is ready`);
    client.ready = true;
    client.timeOffset = Date.now() - (time||Date.now());
    client.sendMessage('HELLO', 'hi');
    return;
  }
  if (type === 'ACCEPT_LZ_STRING') {
    logger.log(`Client ${client} is accepting lz-string`);
    client.lzString = true;
    return;
  }
  if (type === 'FILTER') {
    logger.log(`Client ${client} sent filter ${payload}`);
    return;
  }
  logger.log(`Unhandled message from ${client}: ${msg}`);
}

/*
* LiveSow
*/

const livesowServerChanges = new Set();
const livesowServerDeletes = new Set();
const livesowPlayerChanges = new Set();
const livesowPlayerDeletes = new Set();

export function initializeLivesow() {
  /*const master = new WswMaster();
  master.on('foundServer', (server) => {
    logger.log(`Found server [${server.ip}:${server.port}]`);
  });*/

  /*setInterval(() => {
    WswPlayer.logAll();
  }, 1000);*/

  /*setInterval(() => {
    const initMessage = livesowGetInit();
    const updatesMessage = livesowGetUpdates();
    clients.forEach( (client) => {
      if (!client.initialized) {
        client.initialized = true;
        client.sendMessage('INIT', initMessage);
      } else {
        client.sendMessage('UPDATE', updatesMessage);
      }
    });
    livesowResetUpdates();
  }, 1000);*/

  setInterval(() => {
    const initMessage = livesowGetInit();
    clients.forEach( (client) => {
      if (!client.initialized) {
        client.initialized = true;
        client.sendMessage('INIT', initMessage);
        client.lastAction = Action.getLastAction();
      } else {
        client.sendMessage('UPDATE', getNewStuff(client));
      }
    });
  }, 1000);
}

function livesowGetInit() {
  return {
    servers: WswServer.getAllActive(),
    players: WswPlayer.getAllActive(),
  }
}

function getNewStuff(client) {
  let actions;
  [actions, client.lastAction] = Action.getFrom(client.lastAction);
  return actions;
}

function livesowGetUpdates() {
  return {
    servers: [...livesowServerChanges],
    serverdeletes: [...livesowServerDeletes],
    players: [...livesowPlayerChanges],
    playerdeletes: [...livesowPlayerDeletes],
  }
}

function livesowResetUpdates() {
  livesowServerChanges.clear();
  livesowServerDeletes.clear();
  livesowPlayerChanges.clear();
  livesowPlayerDeletes.clear();
}

// maybe this should be called when site is done loading
// but i'm not sure where that is.
initializeLivesow();

let lastAction = undefined;

function logActions() {
  let actions;
  [actions, lastAction] = Action.getFrom(lastAction);
  logger.log(`actions: ${JSON.stringify(actions)}`);
}

let server = WswServer.getOrCreate('udp4', '81.4.110.69', 44421, (server) => {
  server.on('serverAdd', (server, changes) => {
    // logger.log(`serverAdd [${JSON.stringify(changes)}]`);
    // livesowServerChanges.add(changes);
    Action.add('SERVER_ADD', changes);
    // logActions();
  });
  server.on('serverUpdate', (server, changes) => {
    // logger.log(`serverUpdate [${JSON.stringify(changes)}]`);
    // livesowServerChanges.add(changes);
    Action.add('SERVER_UPDATE', changes);
    // logActions();
  });
  server.on('serverDelete', (server, changes) => {
    // logger.log(`serverDelete [${JSON.stringify(changes)}]`);
    // livesowServerDeletes.add(server.id);
    Action.add('SERVER_DELETE', changes);
    // logActions();
  });
  server.on('playerAdd', (server, player, changes) => {
    // logger.log(`playerAdd [${JSON.stringify(changes)}]`);
    // livesowPlayerChanges.add(changes);
    Action.add('PLAYER_ADD', changes);
    // logActions();
  });
  server.on('playerUpdate', (server, player, changes) => {
    // logger.log(`playerUpdate [${JSON.stringify(changes)}]`);
    // livesowPlayerChanges.add(changes);
    Action.add('PLAYER_UPDATE', changes);
    // logActions();
  });
  server.on('playerDelete', (server, player, changes) => {
    // logger.log(`playerDelete [${JSON.stringify(changes)}]`);
    // livesowPlayerDeletes.add(player.id);
    Action.add('PLAYER_DELETE', changes);
    // logActions();
  });
});

/*(async () => {
  const OOB_PADDING = '\xFF\xFF\xFF\xFF';
  const REQUESTINFO = OOB_PADDING + 'getstatus';
  for ( let i = 0; i < 4; i++ )
  {
    let msg = await udpRequest(
      'udp4', '81.4.110.69', 44429,
      Buffer.from(REQUESTINFO, 'ascii')
    );
    console.log(Date.now(), 'MSG:', msg);
  }
})();*/


/*const masterServer = new MasterServer({
  debug: false
});

masterServer.on('addedServer', (server) => {
  console.log(`MS: Added server ${server}`);
})*/

/*const server = http.createServer(function (req, res) {
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
});*/

//---------------------------------------

/*const WebSocketServer = require('./WebSocketServer')({
  httpServer: server,
  debug: true
});*/

/*const WarsowServer = require('./WarsowServer');

var test = new WarsowServer('udp4', '5.39.27.36', 44472);*/

//-----------------------------------------
