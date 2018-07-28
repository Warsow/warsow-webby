import { acceptConnection } from 'warsow-livesow';
import config from 'warsow-common/config';
import { createLogger } from 'warsow-common/logger';
import { createStore } from './store';
import { getUserById, createUser } from './store/user.mjs';
import { isEmpty, isEmail, isLengthBetween, isUsername } from './validation.mjs';

const PUBLIC_DIR = process.cwd() + '/public';

const SPA_ROUTES = [
  '/',
  '/servers',
  '/download',
  '/kitchen-sink',
];

const logger = createLogger('routes');

export async function setupRoutes(router) {
  const asyncRouter = createAsyncRouter(router);
  const store = await createStore();

  // Livesow websocket endpoint
  router.ws('/livesow', (ws, req) => {
    acceptConnection(ws);
  });

  asyncRouter.post('/api/createUser', async (req, res) => {
    const { body } = req;

    //  Huge validation routine
    // ----------------------------------------------------

    if (isEmpty(body.email)) {
      return sendError(res, 400, 'Email field is empty');
    }
    if (!isEmail(body.email)) {
      return sendError(res, 400, 'Invalid email');
    }
    if (isEmpty(body.username)) {
      return sendError(res, 400, 'Username field is empty');
    }
    if (!isUsername(body.username)) {
      return sendError(res, 400, 'Invalid username', [
        'Username can contain only alphanumeric characters and hyphens',
        'Its length must be between 2 and 38 characters.',
      ]);
    }
    if (isEmpty(body.password)) {
      return sendError(res, 400, 'Password field is empty');
    }
    if (!isLengthBetween(8)(body.password)) {
      return sendError(res, 400, 'Invalid password', [
        'Password must be at least 8 characters long',
      ]);
    }
    if (body.password !== body.passwordConfirm) {
      return sendError(res, 400, 'Passwords do not match');
    }

    const captchaVerified = await verifyCaptcha(body.captcha);
    if (!captchaVerified) {
      return sendError(res, 400, 'Invalid captcha');
    }

    // Create user
    const action = await createUser({
      email: body.email,
      username: body.username,
      password: body.password,
    });

    // Dispatch action to the store
    store.dispatch(action);

    // Return the user object
    const id = action.payload.user.id;
    const db = store.getState();
    return getUserById(db, id);
  });

  router.get('*', (req, res) => {
    if (SPA_ROUTES.includes(req.path)) {
      return res.sendFile(PUBLIC_DIR + '/index.html');
    }
    // Signal 404
    return res.status(404).sendFile(PUBLIC_DIR + '/index.html');
  });

}

function sendError(res, status, message, extra) {
  res.status(status).send({
    error: true,
    message,
    extra,
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

import axios from 'axios';
import qs from 'querystring';

async function verifyCaptcha(captcha) {
  if (!config.RECAPTCH_SECRET) {
    logger.warn('RECAPTCHA_SECRET is not defined in config, skipping verification...');
    return true;
  }
  const res = await axios({
    method: 'post',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      secret: config.RECAPTCHA_SECRET,
      response: captcha,
    }),
  });
  return res.data.success;
}
