import { html, compact } from '../utils.mjs';
import Button from './Button.mjs';

export default function Layout(props = {}) {
  const pageTitle = props.pageTitle || 'Warsow';
  return compact(html`
    <!doctype html>
    <html>
    <head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="description" content="Set in a futuristic cartoonish world, Warsow is a completely free fast-paced first-person shooter (FPS) for Windows, Linux and macOS.">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="${pageTitle}">
    <meta property="og:site_name" content="${pageTitle}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="https://www.warsow.net/images/warsow-logo-256x256.png">
    <meta property="og:image:width" content="256">
    <meta property="og:image:height" content="256">
    <meta property="fb:app_id" content="1437287959922489">

    <title>${pageTitle}</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Share:400,400i,700,700i&amp;subset=latin-ext">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu:400,400i,500,500i,700,700i&amp;subset=cyrillic,cyrillic-ext,latin-ext">
    <link rel="stylesheet" href="/bundles/client.bundle.css">
    <link rel="image_src" href="/images/warsow-logo-256x256.png">
    <link rel="shortcut icon" href="/images/warsow-logo-256x256.png">

    </head>
    <body>

    <div class="header">
      <div class="header-flex container">
        <div class="header-item">
          <a href="/">
            <img class="header-logo" src="images/warsow.png">
          </a>
        </div>
        <div class="header-item">
          ${Button('Home', {
            href: '/',
            color: props.route === '/' && 'orange',
          })}
        </div>
        <div class="header-item">
          ${Button('Servers', {
            href: '/servers',
            color: props.route === '/servers' && 'orange',
          })}
        </div>
        <!-- Temporary text -->
        <div class="header-item header-coming-soon">
          <!-- Full website coming soon! -->
        </div>
        <div class="header-item">
          ${Button('Download now!', {
            href: '/download',
            color: 'purple',
            icon: 'mdi-download',
          })}
        </div>
      </div>
    </div>

    ${props.content}

    <div class="divider divider-hidden"></div>

    ${props.livereload && (
      '<script src="http://localhost:35729/livereload.js?snipver=1"></script>'
    )}

    <script src="/bundles/client.bundle.js"></script>
    </body>
    </html>
  `);
}
