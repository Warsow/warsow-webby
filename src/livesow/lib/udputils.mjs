import dgram from 'dgram';
import dns from 'dns';

const MAX_CONCURRENT = 10;
const udpQueue = new Array();
let numPending = 0;

async function udpQueueAdd(fn) {
  return new Promise( resolve => {
    udpQueue.push({
      fn: fn,
      resolve: resolve,
    });
    udpDeQueue();
  });
}

function udpDeQueue() {
  if ( numPending >= MAX_CONCURRENT ) {
    return false;
  }

  let item = udpQueue.shift();
  if (!item) {
    return false;
  }

  numPending++;
  item.fn().then(val => {
    numPending--;
    item.resolve(val);
    udpDeQueue();
  });

  return true;
}

export async function udpRequest(type, host, port, message, ms = 1000) {
  return udpQueueAdd( () => {
    const socket = dgram.createSocket(type);
    let timeout;
  
    const responsePromise = new Promise( resolve => {
      socket.send(message, 0, message.length, port, host);
      socket.on('message', (msg, rinfo) => {
        socket.close();
        clearTimeout(timeout);
        resolve(msg);
      });
    })
  
    const timeoutPromise = new Promise( resolve => {
      timeout = setTimeout(() => {
        socket.close();
        clearTimeout(timeout);
        resolve(false);
      }, ms);
    });
  
    return Promise.race([
      responsePromise,
      timeoutPromise
    ]);
  }).then( (res) => {
    return res;
  });
}

export function resolveDnsMultiple(serverList) {
  const resolveOne = server => new Promise( (resolve) => {
    dns.lookup( server.host, { all: true }, (err, addressList) => {
    if (err) {
      resolve([]);
    } else {
      const address = addressList.sort( (a,b) => b.family - a.family )[0];
      resolve({
        host: address.address,
        port: server.port,
        family: 'udp' + address.family,
      });
    }
    });
  });

  return Promise.all( serverList.map( resolveOne ) )
    .then( res => [].concat(...res) );
}