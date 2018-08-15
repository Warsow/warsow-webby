import axios from 'axios';
import qs from 'querystring';
import config from 'warsow-common/config';
import { createLogger } from 'warsow-common/logger';

const logger = createLogger('recaptcha');

export async function verifyCaptcha(captcha) {
  if (!config.RECAPTCHA_SECRET) {
    logger.warn('RECAPTCHA_SECRET is not defined in config, skipping...');
    return true;
  }
  const res = await axios({
    method: 'post',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      secret: config.RECAPTCHA_SECRET,
      response: captcha,
    }),
  });
  return res.data.success;
}
