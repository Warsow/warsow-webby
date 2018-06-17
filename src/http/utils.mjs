/**
 * Removes excess whitespace and indentation from the string
 * @param  {string} str
 * @return {string}
 */
export function compact(str) {
  return str
    .trim()
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .join('\n');
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

/**
 * Parses component args
 *
 * Returns an object with: { props, children }
 *
 * @param  {array} args
 * @return {object}
 */
export function parseComponentArgs(args) {
  const result = {
    props: {},
    children: [],
  };
  let i = 0;
  if (args[i] && typeof args[i] === 'object' && !Array.isArray(args[i])) {
    result.props = args[i];
    if (Array.isArray(args[i].children)) {
      result.children = args[i].children.filter(x => !!x);
      delete result.props.children;
    }
    i += 1;
  }
  if (Array.isArray(args[i])) {
    result.children = args[i];
    i += 1;
  }
  return result;
}
