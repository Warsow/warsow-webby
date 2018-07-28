import bcrypt from 'bcrypt';
import lodash from 'lodash';
import { createLogger } from 'warsow-common/logger';
import { createUuid } from 'warsow-common/uuid';

const logger = createLogger('store/user');

async function hashPassword(password) {
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePasswords(a, b) {
  return await bcrypt.compare(a, b);
}

function getUserCollection(db) {
  // Get the collection
  const coll = db.getCollection('user');
  if (coll) {
    return coll;
  }
  // Create a collection
  logger.log('Creating "user" collection');
  db.addCollection('user', {
    unique: ['id'],
    disableMeta: true,
  });
  return db.getCollection('user');
}

function stripUserObject(obj) {
  return obj && lodash.omit(obj, [
    '$loki',
    'password',
  ]);
}


//  Actions
// --------------------------------------------------------

/**
 * @param userData Object containing user fields
 */
export async function createUser(userData) {
  logger.log('Creating user', userData);
  // Create an id
  const id = createUuid();
  // Hash the password
  let password = userData.password !== undefined && await hashPassword(userData.password);
  return {
    type: 'USER_CREATE',
    payload: {
      user: {
        ...userData,
        id,
        password,
      },
    },
  };
}


//  Reducers
// --------------------------------------------------------

export function userReducer(db, action) {
  const { type, payload } = action;

  // Create a collection
  if (db.getCollection('user') === null) {
    logger.log('Creating "user" collection');
    db.addCollection('user', {
      unique: ['id'],
      disableMeta: true,
    });
  }

  // Get the collection
  const coll = db.getCollection('user');

  if (type === 'USER_CREATE') {
    const user = { ...payload.user };
    coll.insert(user);
    return db;
  }

  return db;
}


//  Selectors
// --------------------------------------------------------

export function getUsers(db) {
  return getUserCollection(db)
    .find()
    .map(stripUserObject);
}

export function getUserById(db, id) {
  return stripUserObject(getUserCollection(db).by('id', id));
}
