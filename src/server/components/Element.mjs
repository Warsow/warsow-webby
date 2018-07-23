import { html, parseComponentArgs } from '../utils.mjs';

/**
 * HTML element component
 *
 * Essentially transforms all props into HTML attributes, except:
 *   - classNames: array (concatenates strings
 */
export default function Element(type, ...args) {
  const { props, children } = parseComponentArgs(args);
  const className = props.classNames.filter(x => !!x).join(' ');
  delete props.classNames;
  const attrs = Object.keys(props)
    .filter(x => !!props[x])
    .map(x => `${x}="${quoteattr(props[x])}"`);
  if (className) {
    attrs.unshift(`class="${className}"`);
  }
  if (children.length === 0) {
    return `<${type} ${attrs.join(' ')} />`;
  }
  return `<${type} ${attrs.join(' ')}>${children.join('')}</${type}>`;
}

function quoteattr(str) {
  return ('' + str)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r\n/g, '&#13;')
    .replace(/[\r\n]/g, '&#13;');
}
