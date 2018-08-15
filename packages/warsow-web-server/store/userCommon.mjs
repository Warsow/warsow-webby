import bcrypt from 'bcrypt';
import lodash from 'lodash';

export async function hashPassword(password) {
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function verifyUserPassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

export function getUserCollection(state) {
  // Get the database
  const { db } = state;
  // Get the collection
  const coll = db.getCollection('user');
  if (coll) {
    return coll;
  }
  // Create a collection
  db.addCollection('user', {
    unique: ['id', 'username', 'email'],
    disableMeta: true,
  });
  return db.getCollection('user');
}

export function stripUserObject(obj) {
  return obj && lodash.omit(obj, [
    '$loki',
    'password',
    'emailVerifKey',
  ]);
}
