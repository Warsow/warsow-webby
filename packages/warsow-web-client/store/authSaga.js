import { all, take, takeEvery, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import { routerActions } from './router.js';
import * as authActions from './authActions.js';

export default function* authSaga() {
  yield loadTokensSaga();
  yield all([
    takeEvery('AUTH_REGISTRATION_START', registrationSubmitSaga),
    takeEvery('AUTH_LOGIN_START', loginSaga),
  ]);
}

function* registrationSubmitSaga(action) {
  const { payload } = action;
  console.debug('registrationSubmitSaga', payload);
  try {
    const res = yield call(axios, {
      method: 'post',
      url: '/api/createUser',
      data: payload,
    });
    yield put(authActions.registrationSuccess());
    yield put(routerActions.navigateTo('registrationSuccess'));
  }
  catch (err) {
    const res = err.response;
    if (res && res.data.error) {
      yield put(authActions.registrationError(res.data));
    }
    else {
      yield put(authActions.registrationError({
        message: 'Registration error',
      }));
      console.error(err);
    }
  }
}

function* loginSaga(action) {
  const { payload } = action;
  console.debug('loginSaga', payload);
  try {
    const res = yield call(axios, {
      method: 'post',
      url: '/api/auth/login',
      data: payload,
    });
    const { userId, token } = res.data;
    localStorage.removeItem('authUserId');
    localStorage.removeItem('authToken');
    if (userId) {
      localStorage.setItem('authUserId', userId);
    }
    if (token) {
      localStorage.setItem('authToken', token);
    }
    yield put(authActions.loginSuccess());
    yield put(authActions.loadTokens({ userId, token }));
    // TODO: Fix this mess
    yield take('USER_LOAD');
    const user = yield select(state => state.getIn(['users', userId]));
    yield put(routerActions.navigateTo('user', {
      username: user.get('username'),
    }));
  }
  catch (err) {
    const res = err.response;
    if (res && res.data.error) {
      yield put(authActions.loginError(res.data));
    }
    else {
      yield put(authActions.loginError({
        message: 'Login error',
      }));
      console.error(err);
    }
  }
}

function* loadTokensSaga() {
  console.debug('loadTokensSaga');
  // Small delay to allow all sagas to load
  yield new Promise(res => setTimeout(res, 10));
  const userId = localStorage.getItem('authUserId');
  const token = localStorage.getItem('authToken');
  if (userId && token) {
    yield put(authActions.loadTokens({ userId, token }));
  }
}

function* unloadTokensSaga() {
  localStorage.removeItem('authUserId');
  localStorage.removeItem('authToken');
  yield put(authActions.unloadTokens());
}
