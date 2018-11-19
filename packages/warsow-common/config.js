/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

function isAlphaNumeric(str) {
  return str && /^[a-z\d]+$/i.test(str);
}

// Assign a default NODE_ENV
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'local';
}

// Parse a numeric port
if (Number.isInteger(process.env.PORT)) {
  process.env.PORT = parseInt(process.env.PORT, 10);
}

const env = process.env.NODE_ENV;
const config = {};

// Try loading a default config
if (fs.existsSync(`./config/default.yaml`)) {
  const str = fs.readFileSync(`./config/default.yaml`);
  const obj = yaml.safeLoad(str);
  Object.assign(config, obj);
}

// Try loading a config for current environment
if (isAlphaNumeric(env) && fs.existsSync(`./config/${env}.yaml`)) {
  const str = fs.readFileSync(`./config/${env}.yaml`);
  const obj = yaml.safeLoad(str);
  Object.assign(config, obj);
}

// Try loading a config with overrides
if (fs.existsSync(`./config/override.yaml`)) {
  const str = fs.readFileSync(`./config/override.yaml`);
  const obj = yaml.safeLoad(str);
  Object.assign(config, obj);
}

// Override config with environment variables
for (let i of Object.keys(config)) {
  if (process.env[i] !== undefined) {
    config[i] = process.env[i];
  }
}

// Export the config
module.exports = config;
