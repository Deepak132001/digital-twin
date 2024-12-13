// backend/src/config/database.js
const mongoose = require('mongoose');
const config = require('./environment');
const logger = require('../utils/logger');
const createIndexes = require('../models/indexes');

const connectDB = async () => {
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // Disable automatic index creation
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, options);
    logger.info('MongoDB connected successfully');

    // Create indexes
    await createIndexes();
    logger.info('Database indexes verified');

    // Handle connection events
    mongoose.connection.on('error', err => {
      logger.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDatabase
};