/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/**
 * Removes excessive whitespace and indentation from the string
 *
 * @param  {string} str
 * @return {string}
 */
export function compact(str) {
  // Split string into lines and normalize whitespace
  const lines = str
    .replace(/\r/g, '')
    .replace(/\t/g, '  ')
    .split('\n');
  // Determine indentation level
  let indentation = 0;
  for (let line of lines) {
    // Keep searching for a non-empty line
    if (line.trim().length === 0) {
      continue;
    }
    // Save the indentation
    indentation = line.search(/\S/);
    break;
  }
  // Remove whitespace from lines and join them back into a string
  const indentationRegex = new RegExp(`^\\s{0,${indentation}}`);
  return lines
    .map(x => x.replace(indentationRegex, '').trimEnd())
    .join('\n')
    .trim();
}

/**
 * Template literal tag for rendering HTML
 */
export function html(strings, ...expressions) {
  const length = strings.length;
  let output = '';
  for (let i = 0; i < length; i++) {
    output += strings[i];
    let expr = expressions[i];
    if (typeof expr === 'boolean' || expr === undefined || expr === null) {
      // Nothing
    }
    else if (Array.isArray(expr)) {
      output += expr.join('\n');
    }
    else {
      output += expr;
    }
  }
  return output;
}

const RS_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate a random alphanumeric string
 *
 * @param len Length of the string
 * @return {string}
 */
export function randomString(len = 16) {
  const charsLen = RS_CHARS.length;
  let time = Date.now();
  let str = '';
  for (let i = 0; i < len; i++) {
    const index = (time + Math.random() * charsLen) % charsLen | 0;
    time = Math.floor(time / 16);
    str += RS_CHARS[index];
  }
  return str;
}
