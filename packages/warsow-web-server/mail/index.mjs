/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import config from 'warsow-common/config';
import { createLogger } from 'warsow-common/logger';
import Mailgun from 'mailgun-js';
import * as templates from './templates.mjs';

const logger = createLogger('mail');

// Initialize mailgun (if usage is allowed by config)
const mailgun = config.MAIL_USE_MAILGUN
  && Mailgun({
    apiKey: config.MAILGUN_API_KEY,
    domain: config.MAILGUN_DOMAIN,
  });

export async function sendMail(mail) {
  if (config.MAIL_USE_CONSOLE) {
    logger.log('Sending to console');
    console.log('---------------- Mail ------------------');
    console.log('From:', mail.from);
    console.log('To:', mail.to);
    console.log('Subject:', mail.subject);
    console.log('\n' + (mail.debug || mail.text));
    console.log('-------------- End Mail ----------------');
  }
  if (config.MAIL_USE_MAILGUN) {
    const { from, to, subject } = mail;
    logger.log('Sending using mailgun', { from, to, subject });
    const res = await new Promise((resolve, reject) => {
      mailgun.messages()
        .send(mail, (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res);
        });
    });
    logger.debug('Mailgun response', res);
  }
}

export async function sendUserEmailVerification(user) {
  const mail = templates.renderUserEmailVerification(user);
  return await sendMail(mail);
}
