import { EventEmitter } from 'warsow-common/events';
import { map } from 'lodash';

export class LivesowClient {

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

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
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
    return map(this.A, (x) => new Player(x));
  }

  getTeamBetaName() {
    return this.score.B && this.score.B.n;
  }

  getTeamBetaScore() {
    return this.score.B && this.score.B.s;
  }

  getTeamBetaPlayers() {
    return map(this.B, (x) => new Player(x));
  }

  getPlayers() {
    return map(this.P, (x) => new Player(x));
  }

  getSpectators() {
    return map(this.S, (x) => new Player(x));
  }

  hasTeams() {
    return this.A || this.B;
  }

  hasSpectators() {
    return this.S;
  }

}

class Player {

  constructor(data) {
    this.name = data.n;
    this.score = data.s;
    this.ping = data.p;
  }

}
