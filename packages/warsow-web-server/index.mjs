/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import http from 'http';
import fs from 'fs';
import Express from 'express';
import bodyParser from 'body-parser';
import setupExpressWs from 'express-ws';
import config from 'warsow-common/config';
import { createLogger } from 'warsow-common/logger';
import { setupRoutes } from './routes';
import { setupAuth } from './auth.mjs';

const logger = createLogger('main');
const routeLogger = createLogger('request');

// Create storage dir
try {
  fs.mkdirSync('storage');
}
catch (err) {
  if (err.code !== 'EEXIST') {
    throw err;
  }
}

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

  // Setup body parser
  app.use(bodyParser.json());

  // Setup Webpack
  if (config.NODE_ENV === 'local') {
    logger.log('Using webpack middleware');
    const { setupWebpack } = await import('./webpack.mjs');
    setupWebpack(app);
  }

  // Setup route logger
  if (config.NODE_ENV === 'local') {
    app.use((req, res, next) => {
      routeLogger.log(req.ip, req.path);
      next();
    });
  }

  // Setup auth
  await setupAuth();

  // Setup routes
  await setupRoutes(app);

  // Start the server
  server.listen(config.PORT, (err) => {
    if (err) {
      return logger.error(err);
      process.exit();
    }
    // Usual numeric port
    if (Number.isInteger(config.PORT)) {
      logger.log(`Server running on http://localhost:${config.PORT}/`);
    }
    // Unix socket
    else {
      logger.log(`Server running on '${config.PORT}'`);
      // Set read/write permissions on a socket
      fs.chmodSync(config.PORT, '666');
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
  if (!Number.isInteger(config.PORT)) {
    try {
      fs.unlinkSync(config.PORT);
    }
    catch (err) {}
  }
}

// Start-up server
setupServer().catch((err) => {
  logger.error(err);
  process.exit(1);
});
