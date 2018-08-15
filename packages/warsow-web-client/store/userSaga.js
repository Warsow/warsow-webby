import { all, takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';
import * as userActions from './userActions.js';

export default function* userSaga() {
  yield all([
    takeEvery('AUTH_TOKENS_LOAD', loadAuthUserSaga),
  ]);
}

function* loadAuthUserSaga(action) {
  const { userId } = action.payload;
  const res = yield call(axios, {
    method: 'get',
    url: '/api/getUser',
    params: {
      id: userId,
    },
  });
  const user = res.data;
  yield put(userActions.loadUser(user));
}
