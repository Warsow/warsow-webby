import { createLogger } from './logger.mjs';

const PUBLIC_DIR = process.cwd() + '/public';

const SPA_ROUTES = [
  '/',
  '/servers',
  '/download',
  '/kitchen-sink',
];

const logger = createLogger('routes');

export function setupRoutes(router) {

  // Livesow websocket endpoint
  router.ws('/livesow', (ws, req) => {
    // TODO: Hook into livesow connection handler, e.g. acceptConnection(ws)
  });

  router.get('*', (req, res) => {
    if (SPA_ROUTES.includes(req.path)) {
      return res.sendFile(PUBLIC_DIR + '/index.html');
    }
    // Signal 404
    return res.status(404).sendFile(PUBLIC_DIR + '/index.html');
  });

}
