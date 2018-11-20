/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import config from 'warsow-common/config';
import { html, compact } from 'warsow-common/string';

function baseEmail(subject, title, body) {
  return compact(html`
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        h1, h2, h3 {
          margin: 0.75em 0 0.5em;
          line-height: 1.1em;
          font-weight: normal;
        }

        h1 {
          font-size: 1.4em;
        }

        h2 {
          font-size: 1.2em;
        }

        h3 {
          font-size: 1.1em;
        }

        p {
          margin: 1em 0;
        }

        ul {
          list-style: disc outside;
          padding: 0.5em 0 0.5em 1em;
        }

        a {
          text-decoration: none;
          color: #D46A1E !important;
          transition: color 100ms;
        }

        a:hover {
          color: #D87935 !important;
        }

        table {
          margin: 0 auto;
          border-collapse: collapse;
          border-spacing: 0;
          text-align: left;
        }

        table tbody tr th {
          text-align: right;
          padding-right: 0.5em;
        }

        .email-background {
          background-color: #f4f4f4;
          padding: 1em 0;
        }

        .email-body {
          margin-top: 2em;
          margin-bottom: 2em;
        }

        .email-container {
          max-width: 32em;
          text-align: center;
          margin: 0 auto;
          padding: 1em;
          background-color: #fff;
          box-shadow: rgba(0, 0, 0, 0.05) 0 0 2em;
        }

        .text-small {
          color: #444 !important;
          font-size: 80%;
        }

        .Button {
          padding: 0.75em 1em;
          margin: 1em 0;
          background-color: #444;
          color: #fff !important;
          transition: background-color 100ms;
          border-radius: 0.2em;
        }

        .Button:hover {
          background-color: #575757;
          color: #fff !important;
        }

        .Button--primary {
          background-color: #D46A1E;
        }

        .Button--primary:hover {
          background-color: #D87935;
        }

        .Button--fluid {
          display: block;
          text-align: center;
          margin: 1.5em 0;
        }
      </style>
    </head>
    <body style="font-family: sans-serif; font-size: 12pt; line-height: 1.5em; width: 100%; margin: 0; padding: 0; background-color: #f4f4f4">
      <div class="email-background">
        <div class="email-container">
          <img src="${config.BASE_URL}/images/warsow-logo-256x256.png"
            style="display: block; width: 64px; height: 64px; margin: 1em auto 2em">
          <h1>${title}</h1>
          <div class="email-body">
            ${body}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
}

export function renderUserEmailVerification(user) {
  return {
    from: config.MAIL_DEFAULT_SENDER,
    to: user.email,
    subject: 'Account verification',
    text: compact(`
      Welcome to Warsow!

      Please verify your email address by clicking the link below.

      Email: ${user.email}
      Username: ${user.username}

      ${config.BASE_URL}/email/verify?key=${user.emailVerifKey}

      If this is not your account, don't worry, someone probably just typed the wrong
      email address.
    `),
    html: baseEmail('Account verification', 'Welcome to Warsow!', html`
      <p>Before you join our humble community, please verify your email address.</p>
      <p>Verifying your email helps you secure your account. If you ever forget your
        password, you will now be able to reset it by email.</p>
      <table>
        <tbody>
          <tr>
            <th>Email:</th>
            <td>${user.email}</td>
          </tr>
          <tr>
            <th>Username:</th>
            <td>${user.username}</td>
          </tr>
        </tbody>
      </table>
      <a class="Button Button--primary Button--fluid"
        href="${config.BASE_URL}/email/verify?key=${user.emailVerifKey}">
        Verify your account
      </a>
      <p class="text-small">
        Or click this link:
        <a href="${config.BASE_URL}/email/verify?key=${user.emailVerifKey}">
          ${config.BASE_URL}/email/verify?key=${user.emailVerifKey}
        </a>
      </p>
      <p>If this is not your account, don't worry, someone probably just typed the wrong
        email address.</p>
    `),
  };
}
