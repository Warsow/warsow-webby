export function register(form) {
  return {
    type: 'AUTH_REGISTRATION_START',
    payload: form,
  };
}

export function registrationSuccess() {
  return {
    type: 'AUTH_REGISTRATION_SUCCESS',
  };
}

export function registrationError(error) {
  return {
    type: 'AUTH_REGISTRATION_ERROR',
    payload: { error },
  };
}

export function login(username, password) {
  return {
    type: 'AUTH_LOGIN_START',
    payload: { username, password },
  };
}

export function loginSuccess() {
  return {
    type: 'AUTH_LOGIN_SUCCESS',
  };
}

export function loginError(error) {
  return {
    type: 'AUTH_LOGIN_ERROR',
    payload: { error },
  };
}

export function loadTokens({ userId, token }) {
  return {
    type: 'AUTH_TOKENS_LOAD',
    payload: { userId, token },
  };
}

export function unloadTokens() {
  return {
    type: 'AUTH_TOKENS_UNLOAD',
  };
}
