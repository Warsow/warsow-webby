import { createStore as createReduxStore } from 'redux';
import { applyMiddleware, compose } from 'redux';
import { pipeline } from 'warsow-common/functional';
import { combineReducers } from './utils.js';


//  Constants and objects
// --------------------------------------------------------

export { router } from './router.js';


//  Actions
// --------------------------------------------------------

import * as authActions from './authActions.js';
import { routerActions } from './router.js';

export { authActions };
export { routerActions };


//  Reducers
// --------------------------------------------------------

import { authReducer } from './authReducer.js';
import { globalReducer } from './global.js';
import { livesowReducer } from './livesow.js';
import { routerReducer } from './router.js';
import { userReducer } from './userReducer.js';

// Export all reducers as one reducer
export function createReducer() {
  return pipeline([
    globalReducer,
    routerReducer,
    livesowReducer,
    userReducer,
    combineReducers({
      auth: authReducer,
    }),
  ]);
}


//  Middlewares
// --------------------------------------------------------

import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createRouterMiddleware } from './router.js';
import { createLivesowMiddleware } from './livesow.js';


//  Sagas
// --------------------------------------------------------

import { all } from 'redux-saga/effects';
import authSaga from './authSaga.js';
import userSaga from './userSaga.js';

export function createSaga() {
  return function* rootSaga() {
    yield all([
      authSaga(),
      userSaga(),
    ]);
  };
}


//  Store creator
// --------------------------------------------------------

export function createStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    thunkMiddleware,
    sagaMiddleware,
    createRouterMiddleware(),
    createLivesowMiddleware(),
  ];
  const enhancers = [
    applyMiddleware(...middlewares),
  ];
  const reducer = createReducer();

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const useDevtoolsCompose = process.env.NODE_ENV !== 'production'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const composeEnhancers = useDevtoolsCompose
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      shouldHotReload: false,
      latency: 100,
      maxAge: 50,
    })
    : compose;

  // Create store
  const store = createReduxStore(reducer, composeEnhancers(...enhancers));

  // Run saga
  let sagaTask = sagaMiddleware.run(createSaga());

  // Patch the store to allow replacing sagas
  store.replaceSaga = async saga => {
    console.debug('Replacing saga...');
    sagaTask.cancel();
    await sagaTask.done;
    sagaTask = sagaMiddleware.run(saga);
  };

  return store;
}


//  Utility functions
// --------------------------------------------------------

export { connect, flatConnect } from './utils.js';
