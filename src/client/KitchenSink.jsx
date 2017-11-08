'use strict';

import React from 'react';
import Button from './components/Button.jsx';

export default class KitchenSink extends React.Component {

  render() {
    const Aux = (props) => props.children;
    return <Aux>
      <p>Hello world!</p>
      <h2>Buttons</h2>
      <p>
        <Button text='button' />
        <Button text='button' primary />
        <Button text='button' color='orange' />
        <Button text='button' color='pink' />
        <Button text='button' color='purple' />
      </p>
      <h2>Slanted buttons</h2>
      <p>
        <Button text='button' slanted />
        <Button text='button' slanted primary />
        <Button text='button' slanted color='orange' />
        <Button text='button' slanted color='pink' />
        <Button text='button' slanted color='purple' />
      </p>
    </Aux>;
  }

}
