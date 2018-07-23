import path from 'path';
import http from 'http';
import fs from 'fs';
import Express from 'express';
import setupExpressWs from 'express-ws';
import setupRoutes from './setupRoutes.mjs';

import { createLogger } from './logger.mjs';
const logger = createLogger('setupServer');

async function require(uri) {
  return (await import(uri)).default;
}

// Get environment variables
const port = process.env.PORT || 3000;
const env = process.argv.includes('--dev') && 'local'
  || process.env.NODE_ENV
  || 'production';

async function setupServer() {
  // Create Express app
  const app = new Express();

  // Create HTTP server
  const server = new http.Server(app);

  // Setup websockets
  setupExpressWs(app, server, {});

  // // Setup EJS templating engine
  // app.set('view engine', 'ejs');
  // app.set('views', path.join(__dirname, 'templates'));

  // Define the folder that will be used for static assets
  app.use(Express.static('public'));

  // Setup Webpack
  if (env === 'local') {
    logger.log('Using webpack middleware');
    const setupWebpack = await require('./setupWebpack.mjs');
    setupWebpack(app);
  }

  // Setup routes
  setupRoutes(app);

  // Start the server
  server.listen(port, (err) => {
    if (err) {
      return logger.error(err);
      process.exit();
    }
    // Usual numeric port
    if (Number.isInteger(port)) {
      logger.log(`Server running on http://localhost:${port}/`);
    }
    // Unix socket
    else {
      logger.log(`Server running on '${port}'`);
      // Set read/write permissions on a socket
      fs.chmodSync(port, '666');
      // Setup cleanup callbacks
      process.on('exit', () => cleanUpServer());
      process.on('SIGINT', () => {
        cleanUpServer();
        process.exit();
      });
    }
  });
}

function cleanUpServer() {
  // Force remove the socket file (potentially unsafe?)
  if (!Number.isInteger(port)) {
    try {
      fs.unlinkSync(port);
    } catch (err) {}
  }
}

// Start-up server
setupServer().catch((err) => {
  logger.error(err);
  process.exit(1);
});
