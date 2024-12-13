// backend/src/config/environment.js
require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  INSTAGRAM: {
    CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
    CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
    CALLBACK_URL: process.env.INSTAGRAM_CALLBACK_URL
  },
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY
  }
};
