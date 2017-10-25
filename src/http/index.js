'use strict';

const path = require('path');
const http = require('http');
const Express = require('express');

// Configure ES modules
const loadESM = require('@std/esm')(module, {
  esm: 'js',
});

// Initialize the server and configure support for ejs templates
const app = new Express();

// Define the folder that will be used for static assets
app.use(Express.static('public'));

// Routes
app.get('/', (req, res) => {
  const page = loadESM('./components/home.js').default;
  return res.send(page({
    livereload: process.env.APP_ENV === 'local',
  }));
});

// Start the server
const port = 3000;
const server = new http.Server(app);

server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port}/`);
});

// Start livereload server
if (process.env.APP_ENV === 'local') {
  const livereload = require('livereload');
  livereload
    .createServer()
    .watch('public');
}
