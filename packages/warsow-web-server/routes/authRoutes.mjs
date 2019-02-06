/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import config from 'warsow-common/config';
import { isEmpty, isUsername } from '../validation.mjs';
import { createToken, verifyToken } from '../auth.mjs';
import { getUserByCredentials } from '../store/userSelectors.mjs';
import { sendApiError } from './utils.mjs';

export function setupAuthRoutes(router, store) {
  router.post('/api/auth/login', loginRoute(store));
  router.post('/api/auth/login-statsow', loginStatsowRoute(store));
}

const loginRoute = store => async (req, res) => {
  const { username, password } = req.body;

  if (isEmpty(username)) {
    return sendApiError(res, 400, 'Username field is empty');
  }
  if (!isUsername(username)) {
    return sendApiError(res, 400, 'Invalid username');
  }
  if (isEmpty(password)) {
    return sendApiError(res, 400, 'Password field is empty');
  }

  const state = store.getState();

  // Get user
  const user = await getUserByCredentials(state, username, password);
  if (!user) {
    return sendApiError(res, 401, 'Wrong username or password');
  }

  // Create an authentication token
  const token = await createToken(user.id, 'web-client');

  return res.send({
    userId: user.id,
    token,
  });
};

const loginStatsowRoute = store => async (req, res) => {
  if (Array.isArray(req.body)) {
    const results = [];
    const fakeRes = {
      status: () => fakeRes,
      send: obj => results.push(obj),
    };
    for (let body of req.body) {
      const fakeReq = { body };
      await loginStatsowRoute(store)(fakeReq, fakeRes);
    }
    return res.send(results);
  }
  const { login, password, handle } = req.body;

  const rejectStatsow = (res, login, handle) => {
    return res.status(401).send({
      handle: handle || null,
      login: login || null,
      is_valid: false,
      player_id: null,
      profile_web_url: null,
      profile_access_token: null,
    });
  };

  if (isEmpty(login)) {
    return rejectStatsow(res, login, handle);
  }
  if (!isUsername(login)) {
    return rejectStatsow(res, login, handle);
  }
  if (isEmpty(password)) {
    return rejectStatsow(res, login, handle);
  }

  const state = store.getState();

  // Get user
  const user = await getUserByCredentials(state, login, password);
  if (!user) {
    return rejectStatsow(res, login, handle);
  }

  // Create an authentication token
  const token = await createToken(user.id, 'statsow', {
    longTerm: true,
  });

  return res.send({
    handle: handle || null,
    login: login || null,
    is_valid: false,
    player_id: user.id,
    profile_web_url: config.BASE_URL + '/user/' + user.username,
    profile_access_token: token,
  });
};
