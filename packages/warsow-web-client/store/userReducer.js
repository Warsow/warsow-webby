/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { OrderedMap, fromJS } from 'immutable';

function updateUsers(state, updater) {
  const users = state.get('users') || OrderedMap();
  return state.set('users', users.withMutations(updater));
}

export function userReducer(state, action) {
  const { type, payload } = action;

  if (type === 'USER_LOAD') {
    const usersToLoad = payload.users;
    return updateUsers(state, users => {
      for (let user of usersToLoad) {
        users.set(user.id, fromJS(user));
      }
    });
  }

  return state;
}
