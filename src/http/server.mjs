import path from 'path';
import http from 'http';
import fs from 'fs';
import Express from 'express';
import createRenderer from './createRenderer.mjs';

// // Align with project root
// process.chdir(__dirname + '/../..');

const render = createRenderer();

function setupRoutes(router) {
  router.get('/', async (req, res, next) => {
    const component = import('./components/IndexPage.mjs');
    return res.send(await render(req, component));
  });

  router.get('/download', async (req, res, next) => {
    const component = import('./components/DownloadPage.mjs');
    return res.send(await render(req, component));
  });

  router.get('/servers', async (req, res, next) => {
    const component = import('./components/ServersPage.mjs');
    return res.send(await render(req, component));
  });

  // Not found handler
  router.use(async (req, res, next) => {
    const component = import('./components/NotFoundPage.mjs');
    return res.send(await render(req, component));
  });
}

async function setupServer() {
  // Initialize the server
  const app = new Express();

  // // Setup EJS templating engine
  // app.set('view engine', 'ejs');
  // app.set('views', path.join(__dirname, 'templates'));

  // Define the folder that will be used for static assets
  app.use(Express.static('public'));

  // Setup routes
  setupRoutes(app);

  // Start the server
  const port = process.env.APP_PORT || 3000;
  const server = new http.Server(app);

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
  if (process.env.APP_ENV === 'local') {
    const livereload = (await import('livereload')).default;
    livereload
      .createServer()
      .watch('public');
  }
}

function cleanUpServer() {
  const port = process.env.APP_PORT || 3000;
  // Force remove the socket file
  // (potentially unsafe?)
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
