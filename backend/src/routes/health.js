// backend/src/routes/health.js
const express = require('express');
const router = express.Router();
const DatabaseHealth = require('../utils/dbHealth');
const logger = require('../utils/logger');

router.get('/health', async (req, res) => {
  try {
    const dbConnectivity = await DatabaseHealth.checkConnectivity();
    const indexStatus = await DatabaseHealth.checkIndexes();
    const collectionStats = await DatabaseHealth.getCollectionStats();

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      database: {
        connectivity: dbConnectivity,
        indexes: indexStatus,
        collections: collectionStats
      },
      server: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

module.exports = router;