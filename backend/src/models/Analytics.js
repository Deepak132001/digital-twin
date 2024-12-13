// backend/src/models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  metrics: {
    totalEngagement: Number,
    averageEngagementRate: Number,
    followerGrowth: Number,
    topPerformingPosts: [{
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      },
      engagementRate: Number
    }],
    engagementByHour: [{
      hour: Number,
      rate: Number
    }],
    engagementByDay: [{
      day: Number,
      rate: Number
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);