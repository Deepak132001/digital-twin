// backend/src/utils/dbHealth.js
const mongoose = require('mongoose');
const logger = require('./logger');

class DatabaseHealth {
  static async checkIndexes() {
    try {
      const collections = ['users', 'posts', 'analytics'];
      const indexInfo = {};

      for (const collection of collections) {
        const indexes = await mongoose.connection.collection(collection).indexes();
        indexInfo[collection] = indexes;
      }

      return {
        status: 'success',
        indexes: indexInfo
      };
    } catch (error) {
      logger.error('Error checking indexes:', error);
      throw error;
    }
  }

  static async checkConnectivity() {
    try {
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();
      
      return {
        status: 'success',
        connections: serverStatus.connections,
        uptime: serverStatus.uptime,
        memory: serverStatus.mem,
        version: serverStatus.version
      };
    } catch (error) {
      logger.error('Error checking database connectivity:', error);
      throw error;
    }
  }

  static async getCollectionStats() {
    try {
      const collections = ['users', 'posts', 'analytics'];
      const stats = {};

      for (const collection of collections) {
        stats[collection] = await mongoose.connection
          .collection(collection)
          .stats();
      }

      return {
        status: 'success',
        stats
      };
    } catch (error) {
      logger.error('Error getting collection stats:', error);
      throw error;
    }
  }
}

module.exports = DatabaseHealth;