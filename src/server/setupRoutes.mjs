import { createRenderer } from './renderer.mjs';

const render = createRenderer();

export default function setupRoutes(router) {
  router.get('/', async (req, res, next) => {
    const component = import('./components/IndexPage.mjs');
    return res.send(await render(req, component));
  });

  router.get('/download', async (req, res, next) => {
    const component = import('./components/DownloadPage.mjs');
    return res.send(await render(req, component));
  });

  router.get('/servers', async (req, res, next) => {
    const component = import('./components/ServersPage.mjs');
    return res.send(await render(req, component));
  });

  // Livesow websocket endpoint
  router.ws('/livesow', (ws, req) => {
    // TODO: Hook into livesow connection handler, e.g. acceptConnection(ws)
  });

  // Not found handler
  router.use(async (req, res, next) => {
    const component = import('./components/NotFoundPage.mjs');
    return res.status(404).send(await render(req, component));
  });
}
