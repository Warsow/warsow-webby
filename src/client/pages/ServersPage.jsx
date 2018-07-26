import React, { Component } from 'react';
import { map } from 'lodash';
import ColorTokens from '../components/ColorTokens.jsx';
import { LivesowClient } from '../livesow.js';

// Renders a server list
export default class ServersPage extends Component {

  constructor(props) {
    super(props);
    // Create state
    this.state = {
      servers: {},
    };
  }

  componentDidMount() {
    // Create livesow client
    this.livesow = new LivesowClient();
    // Connect to livesow
    this.livesow.connect('wss://warsow.net/livesow');
    // Subscribe to server list updates
    this.livesow.onUpdate((servers) => {
      // Update servers and re-render the component
      this.setState({ servers });
    });
  }

  componentWillUnmount() {
    this.livesow.disconnect();
  }

  render() {
    return (
      <div className="Layout__container Layout__padded">
        <div className="ServerCardContainer">
          {map(this.state.servers, (server, i) => {
            return <ServerCard key={i} server={server} />;
          })}
        </div>
      </div>
    );
  }

}

// Renders an individual server
function ServerCard(props) {
  const { server } = props;
  return (
    <div className="ServerCard">
      <div className="ServerCard__header">
        <div className="ServerCard__name">
          <a href={`warsow://${server.ip}:${server.port}`}>
            <ColorTokens value={server.getName()} />
          </a>
        </div>
        <div className="ServerCard__meta">
          <div className="ServerCard__gametype">
            {server.getGameType()} / {server.getMapName()}
          </div>
          <input className="ServerCard__ip"
            value={server.ip + ':' + server.port}
            onClick={(e) => e.target.select()}
            readOnly />
        </div>
      </div>
      {server.hasTeams() && (
        <div className="ServerCard__team ServerCard__team--alpha">
          <h3>
            <ColorTokens value={server.getTeamAlphaName()} />
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
                  <td><ColorTokens value={x.name} /></td>
                  <td>{x.score}</td>
                  <td>{x.ping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {server.hasTeams() && (
        <div className="ServerCard__team ServerCard__team--beta">
          <h3>
            <ColorTokens value={server.getTeamBetaName()} />
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
                  <td><ColorTokens value={x.name} /></td>
                  <td>{x.score}</td>
                  <td>{x.ping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!server.hasTeams() && (
        <div className="ServerCard__team ServerCard__team--players">
          {/*<h3>Players</h3>*/}
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Ping</th>
              </tr>
              {server.getPlayers().map((x, i) => (
                <tr key={i}>
                  <td><ColorTokens value={x.name} /></td>
                  <td>{x.score}</td>
                  <td>{x.ping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {server.hasSpectators() && (
        <div className="ServerCard__team ServerCard__team--spec">
          <h3>Spectators</h3>
          {server.getSpectators().map((x, i) => (
            <div key={i} className="ServerCard__spec">
              <ColorTokens value={x.name} /> {x.ping}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
