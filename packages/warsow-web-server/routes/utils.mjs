/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

export function sendApiError(res, status, message, payload = {}) {
  res.status(status).send({
    ...payload,
    error: true,
    message,
  });
}

export function createAsyncRouter(router) {
  return {
    get: (uri, fn) => defineAsyncRoute(router, 'get', uri, fn),
    post: (uri, fn) => defineAsyncRoute(router, 'post', uri, fn),
  };
}

export function defineAsyncRoute(router, method, uri, fn) {
  router[method.toLowerCase()](uri, (req, res, next) => {
    // Run and catch all rejections
    fn(req, res).catch(next);
  });
}

// NOTE: MongoDB injections are possible through HTTP queries.
// possible solution: https://github.com/vkarpov15/mongo-sanitize/blob/master/index.js
export function sanitizeParams(params, allowedKeys = []) {
  const sanitizedParams = {};
  const allowedTypes = ['string', 'number'];
  for (let key of Object.keys(params)) {
    if (key.startsWith('$')) {
      continue;
    }
    if (!allowedKeys.includes(key)) {
      continue;
    }
    if (!allowedTypes.includes(typeof params[key])) {
      continue;
    }
    sanitizedParams[key] = params[key];
  }
  return sanitizedParams;
}
