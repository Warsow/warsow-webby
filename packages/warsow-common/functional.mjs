/**
 * Chains multiple functions into a pipeline and returns a new function.
 *
 * First argument to the transform is the output of the previous transform.
 * Rest of the arguments are passed along unchanged.
 *
 * This variant (pipeline) accepts an array of functions
 *
 * @param {Function[]} funcs Functions that take some value and return a new value
 */
export function pipeline(funcs) {
  return (input, ...rest) => {
    let output = input;
    for (let func of funcs) {
      output = func(output, ...rest);
    }
    return output;
  }
}

/**
 * Chains multiple functions into a pipeline and returns a new function.
 *
 * First argument to the transform is the output of the previous transform.
 * Rest of the arguments are passed along unchanged.
 *
 * This variant (chain) accepts functions as multiple arguments
 *
 * @param {...Function} funcs Functions that take some value and return a new value
 */
export function chain(...funcs) {
  return pipeline(funcs);
}

/**
 * Composes single-argument functions from right to left.
 *
 * All functions might accept a context in form of additional arguments. If the resulting
 * function is called with more than 1 argument, rest of the arguments are passed to
 * all functions unchanged.
 *
 * @param {...Function} funcs The functions to compose
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (input, ...rest) => f(g(h(input, ...rest), ...rest), ...rest)
 */
export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (value, ...rest) => a(b(value, ...rest), ...rest));
}
