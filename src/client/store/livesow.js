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
