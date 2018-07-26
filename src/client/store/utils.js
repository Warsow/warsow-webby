//  Utility functions
// --------------------------------------------------------

export function composeReducers(reducers) {
  return (_state, action) => {
    let state = _state;
    for (let reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}

export function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return (state, action) => {
    return state.withMutations(mutState => {
      for (let key of keys) {
        const reducer = reducers[key];
        const domainState = mutState.get(key);
        mutState.set(key, reducer(domainState, action));
      }
    });
  };
}

//  Custom connectors
// --------------------------------------------------------

// Export react-redux connect
import { connect } from 'react-redux';
export { connect };

const DEFAULT_STATE_TO_PROPS = state => ({ state });
const DEFAULT_DISPATCH_TO_PROPS = dispatch => ({ dispatch });

/**
 * Wrap component to connect it to Redux store via props
 *
 * @param {function} mapStateToProps
 * @param {function} mapDispatchToProps
 * @param {any} Component
 */
export function flatConnect(mapStateToProps = null, mapDispatchToProps = null, Component) {
  if (arguments.length === 1) {
    return flatConnect(
      DEFAULT_STATE_TO_PROPS,
      DEFAULT_DISPATCH_TO_PROPS,
      arguments[0]);
  }
  if (arguments.length === 2) {
    return flatConnect(
      arguments[0],
      DEFAULT_DISPATCH_TO_PROPS,
      arguments[1]);
  }
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
