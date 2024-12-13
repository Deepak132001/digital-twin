// backend/src/services/analytics.js
const logger = require('../utils/logger');

class AnalyticsService {
  async calculateEngagement(posts, userId, startDate, endDate) {
    try {
      const analytics = {
        userId,
        period: {
          start: startDate,
          end: endDate
        },
        metrics: {
          totalEngagement: 0,
          averageEngagementRate: 0,
          followerGrowth: 0,
          topPerformingPosts: [],
          engagementByHour: Array(24).fill(0).map((_, i) => ({
            hour: i,
            rate: 0
          })),
          engagementByDay: Array(7).fill(0).map((_, i) => ({
            day: i,
            rate: 0
          }))
        }
      };

      // Calculate total engagement and populate hourly/daily stats
      posts.forEach(post => {
        const totalPostEngagement = 
          post.engagement.likes + 
          post.engagement.comments + 
          post.engagement.saves + 
          post.engagement.shares;

        analytics.metrics.totalEngagement += totalPostEngagement;

        // Update hourly stats
        const hour = post.postedAt.getHours();
        analytics.metrics.engagementByHour[hour].rate += totalPostEngagement;

        // Update daily stats
        const day = post.postedAt.getDay();
        analytics.metrics.engagementByDay[day].rate += totalPostEngagement;
      });

      // Calculate average engagement rate
      analytics.metrics.averageEngagementRate = 
        posts.length ? analytics.metrics.totalEngagement / posts.length : 0;

      // Get top performing posts
      analytics.metrics.topPerformingPosts = posts
        .sort((a, b) => {
          const engagementA = a.engagement.likes + a.engagement.comments + a.engagement.saves + a.engagement.shares;
          const engagementB = b.engagement.likes + b.engagement.comments + b.engagement.saves + b.engagement.shares;
          return engagementB - engagementA;
        })
        .slice(0, 5)
        .map(post => ({
          postId: post._id,
          engagementRate: (
            (post.engagement.likes + post.engagement.comments + post.engagement.shares) /
            post.insights.impressions * 100
          ).toFixed(2)
        }));

      return analytics;
    } catch (error) {
      logger.error('Calculate engagement error:', error);
      throw error;
    }
  }

  async analyzeTrends(posts) {
    try {
      const trends = posts
        .sort((a, b) => a.postedAt - b.postedAt)
        .map(post => {
          const date = post.postedAt.toISOString().split('T')[0];
          const engagement = 
            post.engagement.likes + 
            post.engagement.comments + 
            post.engagement.saves + 
            post.engagement.shares;
          
          return {
            date,
            engagement
          };
        });

      return trends;
    } catch (error) {
      logger.error('Analyze trends error:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();