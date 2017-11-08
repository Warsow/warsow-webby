'use strict';

export function map(collection, fn) {
  if (!collection) {
    return [];
  }
  // Collection is an array
  if (Array.isArray(collection)) {
    return collection.map(fn);
  }
  // Collection is an object
  return Object
    .keys(collection)
    .map((i) => fn(collection[i], i));
}

/**
 * An empty React container.
 * Works like a <div>, but doesn't create a DOM element.
 */
export function Aux(props) {
  return props.children;
}
