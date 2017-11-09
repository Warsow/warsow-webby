'use strict';

import React from 'react';
import Button from './components/Button.jsx';
import ServerList from './components/ServerList.jsx';
import { Aux, map } from './lib/util.js';

export default class KitchenSink extends React.Component {

  render() {
    return <Aux>
      <p>Hello world!</p>
      <h2>Buttons</h2>
      <Aux>
        <Button text='button' />
        <Button text='button' primary />
        <Button text='button' color='orange' />
        <Button text='button' color='pink' />
        <Button text='button' color='purple' />
      </Aux>
      <h2>Slanted buttons</h2>
      <Aux>
        <Button text='button' slanted />
        <Button text='button' slanted primary />
        <Button text='button' slanted color='orange' />
        <Button text='button' slanted color='pink' />
        <Button text='button' slanted color='purple' />
      </Aux>
      <h2>Livesow server list</h2>
      <ServerList />
    </Aux>;
  }

}
