import LZString from 'lz-string';
import {createUuid} from './lib/uuid.mjs';
import {WswMaster} from './store/wswmaster.mjs';
import {WswServer} from './store/wswserver.mjs';
import {WswPlayer} from './store/wswplayer.mjs';
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
  const master = new WswMaster();
  master.on('foundServer', (server) => {
    // logger.log(`Found server [${server.ip}:${server.port}]`);
  });
  master.on('serverAdd', (server, changes) => {
    Action.add('SERVER_ADD', changes);
  });
  master.on('serverUpdate', (server, changes) => {
    Action.add('SERVER_UPDATE', changes);
  });
  master.on('serverDelete', (server, changes) => {
    Action.add('SERVER_DELETE', changes);
  });
  master.on('playerAdd', (server, player, changes) => {
    Action.add('PLAYER_ADD', changes);
  });
  master.on('playerUpdate', (server, player, changes) => {
    Action.add('PLAYER_UPDATE', changes);
  });
  master.on('playerDelete', (server, player, changes) => {
    Action.add('PLAYER_DELETE', changes);
  });

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
  }, 10000);
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

// maybe this should be called when site is done loading
// but i'm not sure where that is.
initializeLivesow();