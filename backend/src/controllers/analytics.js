// backend/src/controllers/analytics.js
const Analytics = require('../models/Analytics');
const Post = require('../models/Post');
const { calculateEngagement, analyzeTrends } = require('../services/analytics');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

exports.getOverview = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const userId = req.user._id;

    // Get date range based on timeframe
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    // Get analytics data
    const analytics = await Analytics.findOne({
      userId,
      'period.start': { $lte: endDate },
      'period.end': { $gte: startDate }
    });

    if (!analytics) {
      // Generate new analytics if none exist
      const posts = await Post.find({
        userId,
        postedAt: { $gte: startDate, $lte: endDate }
      });

      const newAnalytics = await calculateEngagement(posts, userId, startDate, endDate);
      return res.json(newAnalytics);
    }

    res.json(analytics);
  } catch (error) {
    logger.error('Analytics overview error:', error);
    next(new AppError('Error fetching analytics overview', 500));
  }
};

exports.getEngagementMetrics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user._id;

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const posts = await Post.find({
      userId,
      postedAt: { $gte: startDate, $lte: endDate }
    });

    const metrics = {
      totalEngagement: 0,
      averageEngagementRate: 0,
      engagementByType: {
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0
      },
      trendsOverTime: []
    };

    posts.forEach(post => {
      metrics.engagementByType.likes += post.engagement.likes;
      metrics.engagementByType.comments += post.engagement.comments;
      metrics.engagementByType.saves += post.engagement.saves;
      metrics.engagementByType.shares += post.engagement.shares;
    });

    metrics.totalEngagement = Object.values(metrics.engagementByType).reduce((a, b) => a + b, 0);
    metrics.averageEngagementRate = metrics.totalEngagement / posts.length;

    metrics.trendsOverTime = await analyzeTrends(posts);

    res.json(metrics);
  } catch (error) {
    logger.error('Engagement metrics error:', error);
    next(new AppError('Error fetching engagement metrics', 500));
  }
};

exports.getBestPostingTimes = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ userId }).sort({ 'engagement.total': -1 });

    const timeAnalysis = posts.reduce((acc, post) => {
      const hour = post.postedAt.getHours();
      const day = post.postedAt.getDay();

      if (!acc[day]) {
        acc[day] = {};
      }
      if (!acc[day][hour]) {
        acc[day][hour] = {
          posts: 0,
          totalEngagement: 0
        };
      }

      acc[day][hour].posts++;
      acc[day][hour].totalEngagement += 
        post.engagement.likes + 
        post.engagement.comments + 
        post.engagement.saves + 
        post.engagement.shares;

      return acc;
    }, {});

    // Calculate average engagement for each time slot
    const bestTimes = [];
    Object.entries(timeAnalysis).forEach(([day, hours]) => {
      Object.entries(hours).forEach(([hour, data]) => {
        bestTimes.push({
          day: parseInt(day),
          hour: parseInt(hour),
          averageEngagement: data.totalEngagement / data.posts
        });
      });
    });

    // Sort by engagement and get top 5
    const topTimes = bestTimes
      .sort((a, b) => b.averageEngagement - a.averageEngagement)
      .slice(0, 5);

    res.json(topTimes);
  } catch (error) {
    logger.error('Best posting times error:', error);
    next(new AppError('Error calculating best posting times', 500));
  }
};

exports.getHashtagPerformance = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ userId });

    const hashtagPerformance = {};

    posts.forEach(post => {
      post.hashtags.forEach(tag => {
        if (!hashtagPerformance[tag]) {
          hashtagPerformance[tag] = {
            uses: 0,
            totalEngagement: 0,
            averageEngagement: 0
          };
        }

        hashtagPerformance[tag].uses++;
        const postEngagement = 
          post.engagement.likes + 
          post.engagement.comments + 
          post.engagement.saves + 
          post.engagement.shares;
        
        hashtagPerformance[tag].totalEngagement += postEngagement;
      });
    });

    // Calculate averages and format results
    const formattedResults = Object.entries(hashtagPerformance).map(([tag, data]) => ({
      tag,
      uses: data.uses,
      averageEngagement: data.totalEngagement / data.uses,
      totalEngagement: data.totalEngagement
    }));

    // Sort by average engagement
    formattedResults.sort((a, b) => b.averageEngagement - a.averageEngagement);

    res.json(formattedResults);
  } catch (error) {
    logger.error('Hashtag performance error:', error);
    next(new AppError('Error analyzing hashtag performance', 500));
  }
};

exports.getAudienceInsights = async (req, res, next) => {
  // Implementation for audience insights
  // This would typically involve Instagram API calls and data analysis
  res.status(501).json({ message: 'Audience insights coming soon' });
};

exports.getContentPerformance = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ userId })
      .sort({ postedAt: -1 })
      .limit(20);

    const performance = posts.map(post => ({
      postId: post._id,
      type: post.type,
      postedAt: post.postedAt,
      engagement: post.engagement,
      insights: post.insights,
      engagementRate: (
        (post.engagement.likes + post.engagement.comments + post.engagement.shares) /
        post.insights.impressions * 100
      ).toFixed(2)
    }));

    res.json(performance);
  } catch (error) {
    logger.error('Content performance error:', error);
    next(new AppError('Error analyzing content performance', 500));
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user._id;

    // Validate dates
    if (!startDate || !endDate) {
      throw new AppError('Start and end dates are required', 400);
    }

    // Generate comprehensive report
    const report = await Analytics.findOne({
      userId,
      'period.start': new Date(startDate),
      'period.end': new Date(endDate)
    });

    if (!report) {
      // Generate new report if none exists
      const posts = await Post.find({
        userId,
        postedAt: { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        }
      });

      const newReport = await calculateEngagement(posts, userId, startDate, endDate);
      return res.json(newReport);
    }

    res.json(report);
  } catch (error) {
    logger.error('Report generation error:', error);
    next(new AppError('Error generating analytics report', 500));
  }
};