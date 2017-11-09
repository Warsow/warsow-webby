'use strict';

import React from 'react';
import ColorEntities from './ColorEntities.jsx';
import Livesow from '../lib/Livesow.js';
import { Aux, map } from '../lib/util.js';

// Renders a server list
export default class ServerList extends React.Component {

  constructor(props) {
    super(props);
    // Create state
    this.state = {
      servers: new Map(),
    };
    // Create livesow client
    const livesow = new Livesow();
    // Connect
    livesow
      .connect('ws://81.4.110.69:88')
      .onUpdate((servers) => {
        // Update servers and re-render the component
        this.setState({ servers });
      });
  }

  render() {
    return (
      <div className='servers'>
        {map(this.state.servers, (server, i) => {
          return <Server key={i} server={server} />;
        })}
      </div>
    );
  }

}

// Renders an individual server
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
                  <td><ColorEntities value={x.name} /></td>
                  <td>{x.score}</td>
                  <td>{x.ping}</td>
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
                  <td><ColorEntities value={x.name} /></td>
                  <td>{x.score}</td>
                  <td>{x.ping}</td>
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
                  <td><ColorEntities value={x.name} /></td>
                  <td>{x.score}</td>
                  <td>{x.ping}</td>
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
            <div key={i} className='server-spec'>
              <ColorEntities value={x.name} /> {x.ping}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
