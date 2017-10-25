'use module';

import { trim } from './util.js';

function layout(props = {}) {
  const livereloadElem = '<script src="http://localhost:35729/livereload.js?snipver=1"></script>';
  return trim(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/styles/main.css">
        <title>Warsow</title>
      </head>
      <body>
        ${props.body || ''}
        ${props.livereload ? livereloadElem : ''}
      </body>
    </html>
  `);
}

export default (props = {}) => {
  return layout({
    ...props,
    body: `
      <div class="header">
        <div class="content-container">
          <img class="logo" src="/images/warsow.png">
          <div class="button-slanted">
            <div class="button-slanted-content">
              Text
            </div>
          </div>
        </div>
      </div>
    `,
  });
};
