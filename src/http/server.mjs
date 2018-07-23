import path from 'path';
import http from 'http';
import fs from 'fs';
import Express from 'express';
import setupRoutes from './setupRoutes.mjs';

// // Align with project root
// process.chdir(__dirname + '/../..');

// Get environment variables
const env = process.env.APP_ENV || 'production';
const port = process.env.APP_PORT || 3000;

async function setupServer() {
  // Initialize the Express app
  const app = new Express();

  // Initialize the HTTP server
  const server = new http.Server(app);

  // // Setup EJS templating engine
  // app.set('view engine', 'ejs');
  // app.set('views', path.join(__dirname, 'templates'));

  // Define the folder that will be used for static assets
  app.use(Express.static('public'));

  // Setup routes
  setupRoutes(app);

  // Start the server
  server.listen(port, (err) => {
    if (err) {
      return console.error(err);
    }
    // Usual numeric port
    if (Number.isInteger(port)) {
      console.info(`Server running on http://localhost:${port}/`);
    }
    // Unix socket
    else {
      console.info(`Server running on '${port}'`);
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

  // Start livereload server
  if (env === 'local') {
    const livereload = (await import('livereload')).default;
    livereload
      .createServer()
      .watch('public');
  }
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
  console.error(err);
  process.exit(1);
});
