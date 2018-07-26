const PUBLIC_DIR = process.cwd() + '/public';

export function setupRoutes(router) {

  // Livesow websocket endpoint
  router.ws('/livesow', (ws, req) => {
    // TODO: Hook into livesow connection handler, e.g. acceptConnection(ws)
  });

  router.get('*', (req, res) => {
    return res.sendFile(PUBLIC_DIR + '/index.html');
  });

}
