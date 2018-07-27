import { fromJS } from 'immutable';
import { EventEmitter } from '../utils.js';

function getWsUrl(path) {
  const origin = new URL(window.location.href).origin;
  return origin.replace('http', 'ws') + path;
}

export function createLivesowMiddleware() {
  return livesowMiddleware;
}

function livesowMiddleware(store) {
  const client = new LivesowClient();

  // Dispatch livesow messages as redux actions
  client.onUpdate(msg => {
    // Handle UPDATE as a stream of separate messages
    if (msg.type === 'UPDATE') {
      for (let msg of msg.payload) {
        // Append livesow namespace
        msg.type = `LIVESOW_${msg.type || msg.action}`;
        // Dispatch action
        store.dispatch(msg);
      }
      return;
    }
    // Append livesow namespace
    msg.type = `LIVESOW_${msg.type}`;
    // Dispatch action
    store.dispatch(msg);
  });

  return next => action => {
    const { type, payload } = action;

    if (type === 'LIVESOW_START') {
      const url = getWsUrl('/livesow');
      client.connect(url);
    }

    if (type === 'LIVESOW_STOP') {
      client.disconnect();
    }

    next(action);
  };
}

export function livesowReducer(state, action) {
  const { type, payload } = action;

  if (type === 'LIVESOW_INIT') {
    return state.set('livesow', fromJS(payload));
  }

  //  Servers
  // ------------------------------------------------------

  if (type === 'LIVESOW_SERVER_ADD') {
    return state.updateIn(['livesow', 'servers'], servers => {
      return servers.push(fromJS(payload));
    });
  }

  if (type === 'LIVESOW_SERVER_UPDATE') {
    return state.updateIn(['livesow', 'servers'], servers => {
      const index = servers.findIndex(x => x.get('id') === payload.id)
      if (index === -1) {
        console.log('livesow:reducer', 'did not find server object', action);
        return servers;
      }
      return servers.set(index, servers.get(index).merge(payload));
    });
  }

  if (type === 'LIVESOW_SERVER_DELETE') {
    return state.updateIn(['livesow', 'servers'], servers => {
      const index = servers.findIndex(x => x.get('id') === payload.id);
      if (index === -1) {
        console.log('livesow:reducer', 'did not find server object', action);
        return servers;
      }
      return servers.delete(index);
    });
  }

  //  Players
  // ------------------------------------------------------

  if (type === 'LIVESOW_PLAYER_ADD') {
    return state.updateIn(['livesow', 'players'], players => {
      return players.push(fromJS(payload));
    });
  }

  if (type === 'LIVESOW_PLAYER_UPDATE') {
    return state.updateIn(['livesow', 'players'], players => {
      const index = players.findIndex(x => x.get('id') === payload.id)
      if (index === -1) {
        console.log('livesow:reducer', 'did not find player object', action);
        return players;
      }
      return players.set(index, players.get(index).merge(payload));
    });
  }

  if (type === 'LIVESOW_PLAYER_DELETE') {
    return state.updateIn(['livesow', 'players'], players => {
      const index = players.findIndex(x => x.get('id') === payload.id);
      if (index === -1) {
        console.log('livesow:reducer', 'did not find player object', action);
        return players;
      }
      return players.delete(index);
    });
  }

  return state;
}

export class LivesowClient {

  constructor() {
    this.emitter = new EventEmitter();
  }

  connect(uri) {
    if (this.ws) {
      throw new Error(`Already connected to '${this.ws.url}'!`);
    }
    this.ws = new WebSocket(uri, ['v1']);
    this.ws.onopen = e => console.log('ws:open', e);
    this.ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      console.log('ws:message', msg);
      this.emitter.emit('update', msg);
    };
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
