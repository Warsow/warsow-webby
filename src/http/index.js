'use strict';

const path = require('path');
const http = require('http');
const fs = require('fs');
const Express = require('express');

// Align with project root
process.chdir(__dirname + '/../..');

// // Configure ES modules
// const loadESM = require('@std/esm')(module, {
//   esm: 'js',
// });

// Initialize the server
const app = new Express();

// Setup EJS templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Define the folder that will be used for static assets
app.use(Express.static('public'));

// Routes
app.get('/', (req, res) => {
  return res.render('index', {
    route: 'index',
    livereload: process.env.APP_ENV === 'local',
  });
});

app.get('/download', (req, res) => {
  return res.render('download', {
    route: 'download',
    livereload: process.env.APP_ENV === 'local',
  });
});

app.get('/servers', (req, res) => {
  return res.render('servers', {
    route: 'servers',
    livereload: process.env.APP_ENV === 'local',
  });
});

// Not found handler
app.get((req, res) => {
  return res.render('404');
});

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
  const livereload = require('livereload');
  livereload
    .createServer()
    .watch('public');
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
