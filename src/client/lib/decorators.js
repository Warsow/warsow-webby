'use strict';

import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';

export function bound(target, key, descriptor) {
  const sym = Symbol();
  return {
    configurable: false,
    get() {
      if (!this[sym]) {
        this[sym] = descriptor.value.bind(this);
      }
      return this[sym];
    },
  };
}

export function debounce(duration) {
  return (target, key, descriptor) => {
    const method = descriptor.value;
    descriptor.value = _debounce(method, duration);
    return descriptor;
  };
}

export function throttle(duration) {
  return (target, key, descriptor) => {
    const method = descriptor.value;
    descriptor.value = _throttle(method, duration, { leading: true });
    return descriptor;
  };
}
