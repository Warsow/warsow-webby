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

// Setup EJS templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Define the folder that will be used for static assets
app.use(Express.static('public'));

// Routes
app.get('/', (req, res) => {
  return res.render('index', {
    livereload: process.env.APP_ENV === 'local',
  });
});

app.get('/download', (req, res) => {
  return res.render('download', {
    livereload: process.env.APP_ENV === 'local',
  });
});

// Not found handler
app.get((req, res) => {
  return res.render('404');
});

// Start the server
const port = parseInt(process.env.APP_PORT, 10) || 3000;
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
