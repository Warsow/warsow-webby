import http from 'http';
import fs from 'fs';
import Express from 'express';
import setupExpressWs from 'express-ws';
import { setupRoutes } from './routes.mjs';
import { getEnv, getBoolArgument } from './argparse.mjs';
import { createLogger } from './logger.mjs';

// Get environment variables
const env = getBoolArgument('--dev', 'local') || getEnv('NODE_ENV') || 'production';
const port = getEnv('PORT') || (env === 'local' ? 3000 : 'server.socket');

const logger = createLogger('main');
const routeLogger = createLogger('request');

async function setupServer() {
  // Create Express app
  const app = new Express();

  // Create HTTP server
  const server = new http.Server(app);

  // Setup websockets
  setupExpressWs(app, server, {});

  // Setup route logger
  app.use((req, res, next) => {
    routeLogger.log(req.ip, req.path);
    next();
  });

  // // Setup EJS templating engine
  // app.set('view engine', 'ejs');
  // app.set('views', path.join(__dirname, 'templates'));

  // Define the folder that will be used for static assets
  app.use(Express.static('public'));

  // Setup Webpack
  if (env === 'local') {
    logger.log('Using webpack middleware');
    const { setupWebpack } = await import('./webpack.mjs');
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
