'use module';

export function compact(str) {
  return str
    .trim()
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .join('\n');
}

export function template(strings, ...expressions) {
  const length = strings.length;
  let output = '';
  for (let i = 0; i < length; i++) {
    output += strings[i];
    let expr = expressions[i];
    if (typeof expr === 'boolean' || expr === undefined || expr === null) {
      // Nothing
    }
    else if (Array.isArray(expr)) {
      output += expr.join('');
    }
    else {
      output += expr;
    }
  }
  return output;
}
