import { html } from '../utils.mjs';

export default function ServersPage() {
  return html`
    <div class="content container">
      <h1>Server list</h1>
      <div react-root="ServerList"></div>
    </div>
  `;
}
