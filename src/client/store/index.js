//  Constants and objects
// --------------------------------------------------------

export { router } from './router.js';


//  Actions
// --------------------------------------------------------

export { routerActions } from './router.js';


//  Reducers
// --------------------------------------------------------

import { globalReducer } from './global.js';
import { createRouterReducer } from './router.js';

// Export all reducers as one reducer
export function createReducer() {
  return composeReducers([
    globalReducer,
    createRouterReducer(),
  ]);
}


//  Middlewares
// --------------------------------------------------------

import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createRouterMiddleware } from './router.js';

// Export middlewares as a store enhancer
export function createEnhancer() {
  const middlewares = [
    thunkMiddleware,
    createRouterMiddleware(),
  ];
  return applyMiddleware(...middlewares);
}


//  Utility functions
// --------------------------------------------------------

import { composeReducers, combineReducers, connect, flatConnect } from './utils.js';

export { connect, flatConnect };
