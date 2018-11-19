/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import lodash from 'lodash';
import { sendUserEmailVerification } from '../mail';
import { getUserById, findUsers, findOneUser } from '../store/userSelectors.mjs';
import * as userActions from '../store/userActions.mjs';
import { stripUserObject } from '../store/userCommon.mjs';
import { isEmpty, isEmail, isLengthBetween, isUsername } from '../validation.mjs';
import { verifyCaptcha } from '../recaptcha.mjs';
import { sendApiError, sanitizeParams } from './utils.mjs';

export function setupUserRoutes(router, store) {
  router.get('/api/findUsers', findUsersRoute(store));
  router.get('/api/getUser', getUserRoute(store));
  router.post('/api/createUser', createUserRoute(store));
  router.get('/email/verify', verifyUserEmailRoute(store));
}

const findUsersRoute = store => async (req, res) => {
  const state = store.getState();
  const users = findUsers(state).map(stripUserObject);
  return res.send(users);
};

const getUserRoute = store => async (req, res) => {
  const state = store.getState();
  const query = sanitizeParams(req.query, ['id']);
  if (Object.keys(query).length === 0) {
    return sendApiError(res, 404, 'User not found');
  }
  const user = findOneUser(state, query);
  if (!user) {
    return sendApiError(res, 404, 'User not found');
  }
  return res.send(stripUserObject(user));
};

const createUserRoute = store => async (req, res) => {
  const { body } = req;

  //  Huge validation routine
  // ----------------------------------------------------

  if (isEmpty(body.email)) {
    return sendApiError(res, 400, 'Email field is empty');
  }
  if (!isEmail(body.email)) {
    return sendApiError(res, 400, 'Invalid email');
  }
  if (isEmpty(body.username)) {
    return sendApiError(res, 400, 'Username field is empty');
  }
  if (!isUsername(body.username)) {
    return sendApiError(res, 400, 'Invalid username', {
      extra: [
        'Username can contain only alphanumeric characters and hyphens',
        'Its length must be between 2 and 38 characters.',
      ],
    });
  }
  if (isEmpty(body.password)) {
    return sendApiError(res, 400, 'Password field is empty');
  }
  if (!isLengthBetween(8, Infinity)(body.password)) {
    return sendApiError(res, 400, 'Invalid password', {
      extra: [
        'Password must be at least 8 characters long',
      ],
    });
  }
  if (body.password !== body.passwordConfirm) {
    return sendApiError(res, 400, 'Passwords do not match');
  }

  const captchaVerified = await verifyCaptcha(body.captcha);
  if (!captchaVerified) {
    return sendApiError(res, 400, 'Invalid captcha');
  }

  // Enforce constraints
  const state = store.getState();
  if (findOneUser(state, { email: body.email })) {
    return sendApiError(res, 400, 'User with this email exists');
  }
  if (findOneUser(state, { username: body.username })) {
    return sendApiError(res, 400, 'User with this username exists');
  }

  // Create user
  const action = await userActions.createUser({
    email: body.email,
    username: body.username,
    password: body.password,
  });

  // Dispatch action
  store.dispatch(action);

  // Retrieve created user
  const id = action.payload.user.id;
  const nextState = store.getState();
  const user = getUserById(nextState, id);

  // Send verification email
  await sendUserEmailVerification(user);

  return res.send(stripUserObject(user));
};

const verifyUserEmailRoute = store => async (req, res) => {
  const { key } = req.query;
  const state = store.getState();
  const user = findOneUser(state, {
    emailVerifKey: key,
  });
  if (!user) {
    return res.redirect('/');
  }
  store.dispatch(userActions.verifyUserEmail(user.id));
  return res.redirect('/login?verified=true');
};
