import config from 'warsow-common/config';
import { createLogger } from 'warsow-common/logger';

const logger = createLogger('mail');

export function sendMail(from, to, subject, body) {
  logger.log('Sending mail', from, '->', to);
  if (config.NODE_ENV === 'local') {
    console.log('---------------- Mail ------------------');
    console.log('From:', from);
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('\n' + body);
    console.log('-------------- End Mail ----------------');
  }
  // TODO: implement mail
}
