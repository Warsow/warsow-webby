import Loki from 'lokijs';
import LokiFsStructuredAdapter from 'lokijs/src/loki-fs-structured-adapter.js';

const adapter = new LokiFsStructuredAdapter();
let db = new Loki('storage/database.json', {
  adapter,
  autoload: true,
  autoloadCallback: handleDatabaseLoaded,
  autosave: true,
  autosaveInterval: 5000,
});

function handleDatabaseLoaded() {
  if (db.getCollection('log') === null) {
    db.addCollection('log');
  }
  const log = db.getCollection('log');
  log.insert({
    test: 'test',
    date: Date.now(),
  });
  const result = log.find();
  console.log(result);
}
