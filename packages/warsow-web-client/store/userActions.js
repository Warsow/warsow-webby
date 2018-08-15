export function loadUser(user) {
  return loadUsers([user]);
}

export function loadUsers(users) {
  return {
    type: 'USER_LOAD',
    payload: { users },
  };
}
