// backend/src/models/indexes.js
const User = require('./User');
const Post = require('./Post');
const Analytics = require('./Analytics');
const logger = require('../utils/logger');

async function createIndexes() {
  try {
    // User indexes
    await User.collection.createIndexes([
      { 
        key: { instagramId: 1 },
        unique: true,
        name: 'idx_instagram_id'
      },
      { 
        key: { username: 1 },
        unique: true,
        name: 'idx_username'
      },
      { 
        key: { 'profile.followers': -1 },
        name: 'idx_followers'
      },
      {
        key: { createdAt: -1 },
        name: 'idx_user_created'
      }
    ]);

    // Post indexes
    await Post.collection.createIndexes([
      {
        key: { userId: 1, postedAt: -1 },
        name: 'idx_user_posts'
      },
      {
        key: { instagramPostId: 1 },
        unique: true,
        name: 'idx_instagram_post_id'
      },
      {
        key: { 'engagement.likes': -1 },
        name: 'idx_post_likes'
      },
      {
        key: { hashtags: 1 },
        name: 'idx_hashtags'
      },
      {
        key: { type: 1 },
        name: 'idx_post_type'
      }
    ]);

    // Analytics indexes
    await Analytics.collection.createIndexes([
      {
        key: { 
          userId: 1,
          'period.start': 1,
          'period.end': 1
        },
        name: 'idx_user_period'
      },
      {
        key: { 'metrics.totalEngagement': -1 },
        name: 'idx_total_engagement'
      }
    ]);

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Error creating database indexes:', error);
    throw error;
  }
}

module.exports = createIndexes;