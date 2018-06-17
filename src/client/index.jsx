'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// Styles
import '@mdi/font/css/materialdesignicons.css';
import './styles/index.scss';

// Import root components
import KitchenSink from './KitchenSink.jsx';
import ServerList from './components/ServerList.jsx';

// Export components to the renderer
const components = {
  KitchenSink,
  ServerList,
};

// Render components
const elements = document.querySelectorAll('[react-root]');
for (let element of elements) {
  const name = element.getAttribute('react-root');
  const Component = components[name];
  if (!Component) {
    continue;
  }
  const props = element.dataset;
  ReactDOM.render(<Component {...props} />, element);
}
