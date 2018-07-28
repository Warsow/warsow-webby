import Loki from 'lokijs';
import { createLogger } from 'warsow-common/logger';
import { createUuid } from 'warsow-common/uuid';
import { getActionCollection } from './database.mjs';
import { composeReducers } from './utils.mjs';
import { userReducer } from './user.mjs';

// Create logger
const logger = createLogger('store');

// Store singleton
let store;

export async function createStore() {
  if (store) {
    return store;
  }

  // const middlewares = [];
  // const enhancers = [
  //   // applyMiddleware(...middlewares),
  // ];
  const reducer = composeReducers(userReducer);

  // Create an in-memory database with transient state
  let db = new Loki('storage/transient.json');

  // Preload database
  const actionColl = await getActionCollection();
  const actionCount = actionColl.count();
  if (actionCount > 0) {
    logger.log(`Applying actions (${actionCount})`);
    actionColl.find().forEach(action => {
      db = reducer(db, action);
    });
  }

  // Create store
  store = {
    dispatch(action) {
      logger.log('Dispatching', action.type);
      // Apply action onto transient state
      db = reducer(db, action);
      // Persist the action
      actionColl.insert(action);
    },
    getState() {
      return db;
    },
  };

  return store;
}
