/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { Map, fromJS } from 'immutable';
import { routerActionTypes } from './router.js';

const errorTypes = [
  'AUTH_REGISTRATION_ERROR',
  'AUTH_LOGIN_ERROR',
];

const errorResettingTypes = [
  'AUTH_REGISTRATION_SUCCESS',
  'AUTH_LOGIN_SUCCESS',
  routerActionTypes.TRANSITION_SUCCESS,
];

export function authReducer(state = Map(), action) {
  const { type, payload } = action;

  if (errorTypes.includes(type)) {
    const { error } = payload;
    return state.set('error', fromJS(error));
  }

  if (errorResettingTypes.includes(type)) {
    return state.delete('error');
  }

  if (type === 'AUTH_TOKENS_LOAD') {
    return state
      .set('token', payload.token)
      .set('userId', payload.userId);
  }

  if (type === 'AUTH_TOKENS_UNLOAD') {
    return state
      .delete('token')
      .delete('userId');
  }

  return state;
}
