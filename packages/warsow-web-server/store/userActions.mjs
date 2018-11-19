/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { createUuid } from 'warsow-common/uuid';
import { randomString } from 'warsow-common/string';
import { hashPassword } from './userCommon.mjs';

export async function createUser(userData) {
  // Create an id
  const id = createUuid();
  // Hash the password
  let password = userData.password !== undefined && await hashPassword(userData.password);
  // Create an email verification key
  const emailVerifKey = randomString(16);
  // Return an action
  return {
    type: 'USER_CREATE',
    payload: {
      user: {
        ...userData,
        id,
        password,
        emailVerifKey,
        verified: false,
      },
    },
  };
}

export function verifyUserEmail(userId) {
  return {
    type: 'USER_VERIFY_EMAIL',
    payload: { userId },
  };
}
