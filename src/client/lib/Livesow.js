'use strict';

import EventEmitter from './EventEmitter.js';
import { map } from './util.js';

export default class Livesow {

  constructor() {
    this.emitter = new EventEmitter();
    this.servers = Object.create(null);
  }

  connect(uri) {
    if (this.ws) {
      throw new Error(`Already connected to '${this.ws.url}'!`);
    }
    this.ws = new WebSocket(uri, 'echo-protocol');
    this.ws.addEventListener('open', (e) => {
      console.log('ws:open', e);
    });
    this.ws.addEventListener('message', (e) => {
      const [serverId, payload] = e.data.split('\n');
      // Server is avaiable
      if (payload.startsWith('{')) {
        const server = new Server(JSON.parse(payload));
        this.servers[serverId] = server;
      }
      // Server has gone
      else if (this.servers[serverId]) {
        delete this.servers[serverId];
      }
      // Emit an event with current state
      this.emitter.emit('update', this.servers);
    });
    return this;
  }

  onUpdate(fn) {
    this.emitter.on('update', fn);
    return this;
  }

}

class Server {

  constructor(data) {
    Object.assign(this, data);
  }

  getName() {
    return this.sv_hostname;
  }

  getIp() {
    return this.ip;
  }

  getGameType() {
    return this.gametype;
  }

  getMapName() {
    return this.mapname;
  }

  getClientCount() {
    return this.clients;
  }

  getMaxClients() {
    return this.sv_maxclients;
  }

  getTeamAlphaName() {
    return this.score.A && this.score.A.n;
  }

  getTeamAlphaScore() {
    return this.score.A && this.score.A.s;
  }

  getTeamAlphaPlayers() {
    return map(this.A, (x) => x);
  }

  getTeamBetaName() {
    return this.score.B && this.score.B.n;
  }

  getTeamBetaScore() {
    return this.score.B && this.score.B.s;
  }

  getTeamBetaPlayers() {
    return map(this.B, (x) => x);
  }

  getPlayers() {
    return map(this.P, (x) => x);
  }

  getSpectators() {
    return map(this.S, (x) => x);
  }

  hasTeams() {
    return this.A || this.B;
  }

  hasSpectators() {
    return this.S;
  }

}
