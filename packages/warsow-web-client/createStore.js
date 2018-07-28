import { createStore as createReduxStore } from 'redux';
import { applyMiddleware, compose } from 'redux';
import { createReducer, createEnhancer } from './store';

// Refer to https://github.com/flexdinesh/react-redux-boilerplate
export default function createStore() {
  const middlewares = [];
  const enhancers = [
    // applyMiddleware(...middlewares),
    createEnhancer(),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const useDevtoolsCompose = process.env.NODE_ENV !== 'production'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const composeEnhancers = useDevtoolsCompose
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      shouldHotReload: false,
    })
    : compose;

  // Create store
  const store = createReduxStore(createReducer(),
    composeEnhancers(...enhancers));

  // Make reducers hot reloadable
  if (module.hot) {
    module.hot.accept('./store', () => {
      const { createReducer } = require('./store');
      store.replaceReducer(createReducer());
    });
  }

  return store;
}
