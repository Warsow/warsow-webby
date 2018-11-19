/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { isEmpty, isUsername } from '../validation.mjs';
import { createToken, verifyToken } from '../auth.mjs';
import { getUserByCredentials } from '../store/userSelectors.mjs';
import { sendApiError } from './utils.mjs';

export function setupAuthRoutes(router, store) {
  router.post('/api/auth/login', loginRoute(store));
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
  const token = await createToken({ userId: user.id });

  return res.send({
    userId: user.id,
    token,
  });
};
