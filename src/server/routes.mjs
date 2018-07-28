import lodash from 'lodash';
import { acceptConnection, initializeLivesow } from '../livesow/livesow.mjs';
import { createLogger } from '../common/logger.mjs';
import { getUsers, getActionCollection, createUser } from './store.mjs';

const PUBLIC_DIR = process.cwd() + '/public';

const SPA_ROUTES = [
  '/',
  '/servers',
  '/download',
  '/kitchen-sink',
];

const logger = createLogger('routes');

export function setupRoutes(router) {
  const asyncRouter = createAsyncRouter(router);

  // Livesow websocket endpoint
  router.ws('/livesow', (ws, req) => {
    acceptConnection(ws);
  });

  asyncRouter.get('/createUser', async (req, res) => {
    return await createUser({
      currentTime: Date.now(),
    });
  });

  asyncRouter.get('/getUsers', async (req, res) => {
    return getUsers();
  });

  asyncRouter.get('/getActions', async (req, res) => {
    const actionColl = await getActionCollection();
    return actionColl.find();
  });

  router.get('*', (req, res) => {
    if (SPA_ROUTES.includes(req.path)) {
      return res.sendFile(PUBLIC_DIR + '/index.html');
    }
    // Signal 404
    return res.status(404).sendFile(PUBLIC_DIR + '/index.html');
  });

}

function createAsyncRouter(router) {
  return {
    get:  (uri, fn) => defineAsyncRoute(router, 'get', uri, fn),
    post: (uri, fn) => defineAsyncRoute(router, 'post', uri, fn),
  };
}

function defineAsyncRoute(router, method, uri, fn) {
  router[method.toLowerCase()](uri, (req, res, next) => {
    fn(req, res)
      // If object was returned, send it as JSON
      .then(obj => {
        if (obj !== undefined) {
          res.send(obj);
        }
      })
      // Catch all rejections
      .catch(next);
  });
}
