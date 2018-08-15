import { getUserCollection } from './userCommon.mjs';

export function userReducer(state, action) {
  const { type, payload } = action;

  // Get the collection
  const coll = getUserCollection(state);

  if (type === 'USER_CREATE') {
    const user = { ...payload.user };
    coll.insert(user);
    return state;
  }

  if (type === 'USER_VERIFY_EMAIL') {
    const { userId } = payload;
    const user = coll.by('id', userId);
    user.emailVerifKey = undefined;
    user.verified = true;
    coll.update(user);
    return state;
  }

  return state;
}
