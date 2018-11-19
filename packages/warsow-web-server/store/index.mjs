/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Loki from 'lokijs';
import { createLogger } from 'warsow-common/logger';
import { chain } from 'warsow-common/functional';
import { getActionCollection } from './database.mjs';


//  Reducers
// --------------------------------------------------------

import { userReducer } from './userReducer.mjs';

function createReducer() {
  return chain(userReducer);
}


//  Store creator
// --------------------------------------------------------

export async function createStore() {
  // Create logger
  const logger = createLogger('store');

  // Create a reducer
  const reducer = createReducer();

  // Create initial state
  let state = {
    // Create an in-memory database with transient state
    db: new Loki('storage/transient.json'),
  };

  // Preload database
  const actionColl = await getActionCollection();
  const actionCount = actionColl.count();
  if (actionCount > 0) {
    logger.log(`Applying actions (${actionCount})`);
    actionColl.find().forEach(action => {
      state = reducer(state, action);
    });
  }

  // Create store
  return {
    dispatch(action) {
      // Validate the action
      if (!action) {
        throw new Error(`Action must be an object! (got: ${action})`);
      }
      if (action.then) {
        throw new Error(`Action should not be an instance of Promise! (have you forgot to use await?)`);
      }
      if (!action.type) {
        throw new Error(`Missing action type!`);
      }
      logger.log('Dispatching', action.type);
      logger.debug('Action payload', action.payload);
      // Apply action onto transient state
      state = reducer(state, action);
      // Persist the action
      actionColl.insert(action);
    },
    getState() {
      return state;
    },
  };
}
