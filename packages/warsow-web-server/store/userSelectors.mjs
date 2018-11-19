/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { getUserCollection, verifyUserPassword } from './userCommon.mjs';

export function findUsers(state, query) {
  return getUserCollection(state).find(query);
}

export function findOneUser(state, query) {
  return getUserCollection(state).findOne(query);
}

export function getUserById(state, id) {
  return getUserCollection(state).by('id', id);
}

export async function getUserByCredentials(state, identifier, password) {
  const user = getUserCollection(state)
    .findOne({
      $or: [
        { email: identifier },
        { username: identifier },
      ],
    });
  if (!user) {
    return;
  }
  const passwordIsValid = await verifyUserPassword(user, password);
  if (!passwordIsValid) {
    return;
  }
  return user;
}
