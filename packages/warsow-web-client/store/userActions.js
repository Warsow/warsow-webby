/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

export function loadUser(user) {
  return loadUsers([user]);
}

export function loadUsers(users) {
  return {
    type: 'USER_LOAD',
    payload: { users },
  };
}
