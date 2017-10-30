'use module';

import { compact, template } from './util.js';

function layout(props = {}) {
  const page = template`
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
        ${props.body}
        ${props.livereload && `
          <script src="http://localhost:35729/livereload.js?snipver=1"></script>
        `}
      </body>
    </html>
  `;
  return compact(page);
}

function button(props = {}) {
  return template`
    <div class="button-slanted" ${props.color && `style="background: ${props.color}"`}>
      <div class="button-slanted-content">
        ${props.text}
      </div>
    </div>
  `;
}

export default (props = {}) => {
  return layout({
    ...props,
    body: template`
      <div class="header">
        <div class="content-container">
          <img class="logo" src="/images/warsow.png">
          ${button({
            text: 'Text',
          })}
        </div>
      </div>
    `,
  });
};
