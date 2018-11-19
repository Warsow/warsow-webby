/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import express from 'express';
import config from 'warsow-common/config';
import { acceptConnection } from 'warsow-livesow';
import { createLogger } from 'warsow-common/logger';
import { createStore } from '../store';

import { createAsyncRouter, sendApiError } from './utils.mjs';
import { setupAuthRoutes } from './authRoutes.mjs';
import { setupUserRoutes } from './userRoutes.mjs';

const logger = createLogger('routes');

const PUBLIC_DIR = process.cwd() + '/public';
const SPA_ROUTES = [
  '/',
  '/servers',
  '/download',
  '/kitchen-sink',
];

export async function setupRoutes(router) {
  const store = await createStore();

  // Livesow websocket endpoint
  router.ws('/livesow', (ws, req) => {
    acceptConnection(ws);
  });

  // API endpoint
  const asyncRouter = createAsyncRouter(router);
  await setupAuthRoutes(asyncRouter, store);
  await setupUserRoutes(asyncRouter, store);

  // Not found handler for API
  router.use('/api', (req, res) => {
    return sendApiError(res, 404, 'Resource not found');
  });

  // Single page application endpoint
  router.get('*', (req, res) => {
    if (SPA_ROUTES.includes(req.path)) {
      return res.sendFile(PUBLIC_DIR + '/index.html');
    }
    // Signal 404
    return res.status(404).sendFile(PUBLIC_DIR + '/index.html');
  });
}
