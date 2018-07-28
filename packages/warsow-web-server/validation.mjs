import validator from 'validator';

export function isEmail(str) {
  return isString(str) && validator.isEmail(str);
}

export function isEmpty(obj) {
  return isNullish(obj) || obj === '';
}

export function isString(obj) {
  return typeof obj === 'string';
}

export function isNullish(obj) {
  return obj === undefined || obj === null;
}

export function isLengthBetween(minLen, maxLen) {
  return str => str
    && str.length
    && (isNullish(minLen) || str.length >= minLen)
    && (isNullish(maxLen) || str.length <= maxLen)
}

// Github-style usernames
const REGEX_USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){2,38}$/i;

export function isUsername(str) {
  return isString(str) && REGEX_USERNAME.test(str);
}
