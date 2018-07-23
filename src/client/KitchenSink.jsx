import React, { Component, Fragment } from 'react';
import Button from './components/Button.jsx';
import ServerList from './components/ServerList.jsx';

export default class KitchenSink extends Component {

  render() {
    return <Fragment>
      <p>Hello world!</p>
      <h2>Buttons</h2>
      <div>
        <Button text='button' />
        <Button text='button' primary={true} />
        <Button text='button' color='orange' />
        <Button text='button' color='pink' />
        <Button text='button' color='purple' />
      </div>
      <h2>Slanted buttons</h2>
      <div>
        <Button text='button' slanted={true} />
        <Button text='button' slanted={true} primary={true} />
        <Button text='button' slanted={true} secondary={true} />
      </div>
      <div>
        <Button text='button' slanted={true} color='red' />
        <Button text='button' slanted={true} color='orange' />
        <Button text='button' slanted={true} color='yellow' />
        <Button text='button' slanted={true} color='olive' />
        <Button text='button' slanted={true} color='green' />
        <Button text='button' slanted={true} color='oceanic' />
        <Button text='button' slanted={true} color='teal' />
        <Button text='button' slanted={true} color='blue' />
        <Button text='button' slanted={true} color='violet' />
        <Button text='button' slanted={true} color='purple' />
        <Button text='button' slanted={true} color='pink' />
      </div>
      {/*
      <h2>Livesow server list</h2>
      <ServerList />
      */}
    </Fragment>;
  }

}
