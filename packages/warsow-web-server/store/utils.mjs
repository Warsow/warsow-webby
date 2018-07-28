//  Utility functions
// --------------------------------------------------------

export function composeReducers(...reducers) {
  return (_state, action) => {
    let state = _state;
    for (let reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}
