'use strict';

import React from 'react';
import Button from './components/Button.jsx';
import Livesow from './lib/Livesow.js';
import { Aux, map } from './lib/util.js';

export default class KitchenSink extends React.Component {

  constructor(props) {
    super(props);
    // Create state
    this.state = {
      servers: new Map(),
    };
    // Connect to livesow
    const livesow = new Livesow();
    livesow
      .connect('ws://81.4.110.69:88')
      .onUpdate((servers) => {
        console.log(servers);
        this.setState({ servers });
      });
  }

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
      <Aux>
        <div className='servers'>
          {map(this.state.servers, (server, i) => {
            return <Server key={i} server={server} />;
          })}
        </div>
      </Aux>
    </Aux>;
  }

}

const COLOR_ENTITY_REGEX = /\^[0-9]/g;
const COLOR_ENTITY_MAP = {
  '^0': '#000',
  '^1': '#f00',
  '^2': '#0f0',
  '^3': '#ff0',
  '^4': '#00f',
  '^5': '#0ff',
  '^6': '#f0f',
  '^7': '#fff',
  '^8': '#f80',
  '^9': '#888',
};

function ColorEntities(props) {
  const strings = props.value.split(COLOR_ENTITY_REGEX);
  const entities = props.value.match(COLOR_ENTITY_REGEX);
  return strings
    .map((str, i) => {
      if (!str) {
        return false;
      }
      if (i === 0) {
        return str;
      }
      const color = COLOR_ENTITY_MAP[entities[i - 1]];
      return <span key={i} style={{ color }}>{str}</span>;
    });
}

function Server(props) {
  const server = props.server;
  return (
    <div className='server'>
      <div className='server-header'>
        <div className='server-name'>
          <ColorEntities value={server.getName()} />
        </div>
        <div className='server-gametype'>
          {server.getGameType()} / {server.getMapName()}
        </div>
        <div className='server-ip'>
          {server.ip}:{server.port}
        </div>
      </div>
      {server.hasTeams() && (
        <div className='server-team-alpha'>
          <h3>
            {server.getTeamAlphaName()}
            <strong>{server.getTeamAlphaScore()}</strong>
          </h3>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Ping</th>
              </tr>
              {server.getTeamAlphaPlayers().map((x, i) => (
                <tr key={i}>
                  <td><ColorEntities value={x.n} /></td>
                  <td>{x.s}</td>
                  <td>{x.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {server.hasTeams() && (
        <div className='server-team-beta'>
          <h3>
            {server.getTeamBetaName()}
            <strong>{server.getTeamBetaScore()}</strong>
          </h3>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Ping</th>
              </tr>
              {server.getTeamBetaPlayers().map((x, i) => (
                <tr key={i}>
                  <td><ColorEntities value={x.n} /></td>
                  <td>{x.s}</td>
                  <td>{x.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!server.hasTeams() && (
        <div className='server-team-players'>
          <h3>Players</h3>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Ping</th>
              </tr>
              {server.getPlayers().map((x, i) => (
                <tr key={i}>
                  <td><ColorEntities value={x.n} /></td>
                  <td>{x.s}</td>
                  <td>{x.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {server.hasSpectators() && (
        <div className='server-team-spec'>
          <h3>Spectators</h3>
          {server.getSpectators().map((x, i) => (
            <div className='server-spec'>
              <ColorEntities value={x.n} /> {x.p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
