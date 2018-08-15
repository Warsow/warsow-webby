import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from './store';

import './styles/index.scss';

const store = createStore();

function renderLayout() {
  const MOUNT_NODE = document.querySelector('.react-root');
  try {
    const Layout = require('./layout').Layout;
    const component = (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    ReactDOM.render(component, MOUNT_NODE);
  }
  catch (err) {
    console.error(err);
    // TODO: Custom error handler
  }
}

// Make Layout component hot reloadable
if (module.hot) {
  module.hot.accept(['./layout', './store'], () => {
    console.debug('Replacing the layout component...');
  });
}

// Make store hot reloadable
if (module.hot) {
  module.hot.accept('./store', () => {
    console.debug('Replacing the store module...');
    const { createReducer, createSaga } = require('./store');
    store.replaceReducer(createReducer());
    store.replaceSaga(createSaga());
  });
}

// Initialize the page
window.addEventListener('load', () => {
  renderLayout();
});
