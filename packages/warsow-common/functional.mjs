/**
 * Composes multiple value transforms into one transform.
 *
 * You can also regard this pattern as a pipeline: you compose functions into a pipeline,
 * and then call that pipeline with an input, which will go through all the functions.
 *
 * @param transforms Functions that take some value and return a new value
 */
export function compose(...transforms) {
  return (obj, ...rest) => {
    let output = obj;
    for (let transform of transforms) {
      output = transform(output, ...rest);
    }
    return output;
  }
}
