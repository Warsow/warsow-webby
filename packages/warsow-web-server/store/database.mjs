import Loki from 'lokijs';
import LokiFsStructuredAdapter from 'lokijs/src/loki-fs-structured-adapter.js';
import { createLogger } from 'warsow-common/logger';

const logger = createLogger('store/db');

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

export async function getActionCollection() {
  const db = await getDatabase();
  return db.getCollection('action');
}
