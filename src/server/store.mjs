import Loki from 'lokijs';
import LokiFsStructuredAdapter from 'lokijs/src/loki-fs-structured-adapter.js';
import { createLogger } from '../common/logger.mjs';
import { createUuid } from '../common/uuid.mjs';

// List of transient collections
const TRANSIENT_COLLECTIONS = [
  {
    name: 'user',
    applyFn: applyActionOnUserCollection,
    createFn: db => {
      db.addCollection('user', {
        unique: ['id'],
        disableMeta: true,
      });
    },
  },
]

// Create logger
const logger = createLogger('store');

// Create a persistent database
const adapter = new LokiFsStructuredAdapter();
const maybeDatabase = new Promise(resolve => {
  const db = new Loki('storage/database.json', {
    adapter,
    autoload: true,
    autoloadCallback: () => onDatabaseLoaded(db, resolve),
    autosave: true,
    autosaveInterval: 5000,
    serializationMethod: 'pretty',
  });
});

// Create an in-memory database with transient state
const transientDatabase = new Loki('storage/database-transient.json');

/**
 * @param db {Loki}
 * @param resolve {function}
 */
function onDatabaseLoaded(db, resolve) {
  logger.log('Database loaded');

  // Ensure the existence of action collection
  if (db.getCollection('action') === null) {
    logger.log('Creating "action" collection');
    db.addCollection('action');
  }
  const actionColl = db.getCollection('action');

  // Create transient collections
  logger.log('Creating transient collections');
  for (let collDef of TRANSIENT_COLLECTIONS) {
    collDef.createFn(transientDatabase);
  }

  // Populate transient collection with latest state
  const count = actionColl.count();
  if (count > 0) {
    logger.log(`Applying actions (${count})`);
    actionColl.find().forEach(action => {
      const { type, payload } = action;
      applyAction(transientDatabase, { type, payload });
    });
  }

  logger.log('Ready');
  resolve(db);
}

/**
 * Get a database instance
 *
 * @returns {Promise<Loki>}
 */
export async function getDatabase() {
  return await maybeDatabase;
}

/**
 * Dispatch an action
 *
 * @param action Action object
 */
export async function dispatch(action) {
  logger.log('Dispatching', action.type);
  // Persist the action
  const actionColl = await getActionCollection();
  actionColl.insert(action);
  // Apply action onto transient state
  applyAction(transientDatabase, action);
}

function applyAction(db, action) {
  // logger.log('Applying action', action.type);
  for (let collDef of TRANSIENT_COLLECTIONS) {
    const { name, applyFn } = collDef;
    const coll = db.getCollection(name);
    applyFn(coll, action);
  }
}

function applyActionOnUserCollection(coll, action) {
  const { type, payload } = action;
  if (type === 'USER_CREATE') {
    coll.insert({ ...payload.user });
  }
}

export async function getActionCollection() {
  const db = await getDatabase();
  return db.getCollection('action');
}

export function getUserCollection() {
  return transientDatabase.getCollection('user');
}

export function getUsers() {
  return getUserCollection().find();
}

export function getUserById(id) {
  return getUserCollection().by('id', id);
}

export async function createUser(user) {
  logger.log('Creating user', user);
  const id = createUuid();
  await dispatch({
    type: 'USER_CREATE',
    payload: {
      user: { ...user, id },
    },
  });
  return getUserById(id);
}
