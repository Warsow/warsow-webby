import React from 'react';
import { flatConnect } from '../store';
import { Button, Link } from '../components';

import DownloadPage from '../pages/DownloadPage.jsx';
import IndexPage from '../pages/IndexPage.jsx';
import KitchenSink from '../pages/KitchenSink.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ServersPage from '../pages/ServersPage.jsx';
import { process } from 'ipaddr.js';

const IS_PRODUCTION = process && process.env && process.env === 'production';

function getRoutedComponent(route, transitionError) {
  if (!route) {
    if (transitionError) {
      return <NotFoundPage />;
    }
    return null;
  }
  const { name, params } = route;
  if (name === 'index') {
    return <IndexPage />;
  }
  if (name === 'kitchenSink') {
    return <KitchenSink />;
  }
  if (name === 'servers') {
    return <ServersPage />;
  }
  if (name === 'download') {
    return <DownloadPage />;
  }
  if (name === 'login') {
    return <LoginPage />;
  }
  return <NotFoundPage />;
}

export default flatConnect(
  state => ({
    drawerOpened: state.get('drawerOpened'),
    route: state.getIn(['router', 'route']),
    transitionError: state.getIn(['router', 'transitionError']),
  }),
  function Layout(props) {
    const { drawerOpened, state, route, transitionError, dispatch } = props;
    const routeName = route && route.name;
    const component = getRoutedComponent(route, transitionError);
    const currentYear = new Date().getFullYear();
    return (
      <div className="Layout">
        <div className="Layout__navbar">
          <div className="Navbar">
            <div className="Navbar__items Layout__container">
              <div className="Navbar__item--menu"
                onClick={() => {
                  dispatch({
                    type: drawerOpened ? 'DRAWER_CLOSE' : 'DRAWER_OPEN',
                  });
                }}>
                <i className="icon bars fitted" />
              </div>
              <div className="Navbar__item--logo">
                <Link routeName="index">
                  <img src="/images/warsow.png" alt="Warsow Logo" />
                </Link>
              </div>
              <div className="Navbar__item">
                <Button as={Link} underlined primary={routeName === 'index'}
                  routeName="index"
                  text="Home" />
              </div>
              <div className="Navbar__item">
                <Button as={Link} underlined primary={routeName === 'servers'}
                  routeName="servers"
                  text="Servers" />
              </div>
              {IS_PRODUCTION || (
                <div className="Navbar__item">
                  <Button as={Link} underlined primary={routeName === 'kitchenSink'}
                    routeName="kitchenSink"
                    text="Kitchen Sink" />
                </div>
              )}
              <div className="Navbar__item">
                <Button as={Link} underlined primary={routeName === 'login'}
                  routeName="login"
                  text="Login" />
              </div>
              <div className="Navbar__items-right">
                <div className="Navbar__item">
                  <Button as={Link} slanted secondary
                    routeName="download"
                    text="Download now!"
                    icon="download" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {drawerOpened && (
          <div className="Layout__drawer">
            <div className="Layout__drawer-item">
              <Button as={Link} underlined fluid
                routeName="index"
                text="Home" />
            </div>
            <div className="Layout__drawer-item">
              <Button as={Link} underlined fluid
                routeName="servers"
                text="Servers" />
            </div>
            <div className="Layout__drawer-item">
              <Button as={Link} slanted fluid secondary
                routeName="download"
                text="Download now!"
                icon="download" />
            </div>
          </div>
        )}

        <div className="Layout__content">
          {component}
        </div>

        <div className="Layout__footer">
          <div className="Layout__container text-center">
            Chasseur de Bots, {currentYear} ©
          </div>
        </div>
      </div>
    );
  }
);
