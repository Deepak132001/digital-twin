// backend/src/server.js
require('dotenv').config();
const logger = require('./utils/logger');

// Check required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'SESSION_SECRET',
  'INSTAGRAM_CLIENT_ID',
  'INSTAGRAM_CLIENT_SECRET',
  'FRONTEND_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Import and start the app
const app = require('./app');