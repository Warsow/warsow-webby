/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Immutable from 'immutable';
import { isArray, isPlainObject } from 'lodash';

/**
 * Helper for conditionally adding/removing classes in React
 *
 * @return {string}
 */
export function classes() {
  const classNames = [];
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (!arg) {
      continue;
    }
    if (typeof arg === 'string' || typeof arg === 'number') {
      classNames.push(arg);
    }
    else if (Array.isArray(arg) && arg.length) {
      const inner = classes.apply(null, arg);
      if (inner) {
        classNames.push(inner);
      }
    }
    else if (typeof arg === 'object') {
      for (let key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classNames.push(key);
        }
      }
    }
  }
  return classNames.join(' ');
};

/**
 * Test a keyPath with a pattern
 *
 * @param  {[type]} keyPath [description]
 * @param  {[type]} uri     [description]
 * @return {[type]}         [description]
 */
export function testKeyPath(keyPath, uri) {
  if (uri.charAt(0) !== '/') {
    throw TypeError('testKeyPath URI must begin with "/"!');
  }
  const patterns = uri.split('/');
  patterns.shift();
  // Iterate over patterns
  const len = Math.max(patterns.length, keyPath.length);
  for (let i = 0; i < len; i++) {
    // Wildcard (multi-key)
    if (patterns[i] === '**') {
      // Last pattern
      if (i === patterns.length - 1) {
        // Skip all remaining keys
        return true;
      }
      continue;
    }
    // Wildcard (single-key)
    if (patterns[i] === '*') {
      continue;
    }
    // Exact match
    if (patterns[i] === keyPath[i]) {
      continue;
    }
    // Not matching
    return false;
  }
  return true;
};

/**
 * Recursively walk over the collection, and apply the supplied converter
 * function to every collection it meets.
 *
 * Converter function signature:
 *   (value: Immutable.Seq, keyPath: Array<string>) => any
 *
 * This function is an adapted version of 'fromJS' from ImmutableJS.
 *
 * @param  {any} value Collection
 * @param  {function} converter Converter function
 * @return {any}
 */
export function transformCollection(value, converter,
  stack = [], key = '', keyPath = []) {
  let seq = null;
  if (isArray(value)) {
    seq = Immutable.Seq.Indexed(value);
  }
  else if (isPlainObject(value)) {
    seq = Immutable.Seq.Keyed(value);
  }
  else if (Immutable.Record.isRecord(value)) {
    seq = value.toSeq();
  }
  else if (Immutable.isCollection(value)) {
    seq = value.toSeq();
  }
  if (seq) {
    if (~stack.indexOf(value)) {
      throw new TypeError('Cannot convert circular structure to Immutable');
    }
    stack.push(value);
    if (key !== '') {
      keyPath.push(key);
    }
    const walkedSeq = seq.map((x, i) => {
      return transformCollection(x, converter, stack, i, keyPath);
    });
    const converted = converter.call(null, walkedSeq, keyPath);
    stack.pop();
    keyPath.pop();
    return converted;
  }
  return value;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
