// backend/src/controllers/analyticsController.js
const Analytics = require('../models/Analytics');
const analyticsService = require('../services/analyticsService');
const instagramService = require('../services/instagramService');

exports.getDashboardStats = async (req, res) => {
    try {
        const { user } = req;

        if (!user.instagram?.connected) {
            return res.status(400).json({
                status: 'error',
                message: 'Instagram account not connected'
            });
        }

        // Get current Instagram data
        const profile = await instagramService.getUserProfile(user.instagram.accessToken);
        const media = await instagramService.getMediaInsights(user.instagram.accessToken);

        // Update analytics with new data
        await analyticsService.updateAnalytics(user._id, {
            profile,
            posts: media
        });

        // Get analytics summary
        const analytics = await analyticsService.getAnalyticsSummary(user._id);

        res.json({
            status: 'success',
            data: {
                currentStats: {
                    followers: profile.followers_count,
                    posts: profile.media_count,
                    engagement: analytics.engagement[analytics.engagement.length - 1]?.rate || 0
                },
                trends: {
                    followers: analytics.followers,
                    engagement: analytics.engagement
                },
                insights: {
                    bestTimes: analytics.bestTimes,
                    topHashtags: analytics.topHashtags
                },
                recentPosts: analytics.recentPosts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.getEngagementMetrics = async (req, res) => {
    try {
        const { timeframe = '7d' } = req.query;
        const analytics = await Analytics.findOne({ userId: req.user._id });

        if (!analytics) {
            return res.status(404).json({
                status: 'error',
                message: 'No analytics data found'
            });
        }

        const days = parseInt(timeframe);
        const endDate = new Date();
        const startDate = new Date(endDate - days * 24 * 60 * 60 * 1000);

        const engagementData = analytics.instagram.posts
            .filter(post => post.date >= startDate)
            .map(post => ({
                date: post.date,
                engagement: post.engagement,
                likes: post.likes,
                comments: post.comments
            }));

        res.json({
            status: 'success',
            data: {
                engagement: engagementData,
                averageEngagement: engagementData.reduce((acc, curr) => acc + curr.engagement, 0) / engagementData.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.getBestPostingTimes = async (req, res) => {
    try {
        const analytics = await Analytics.findOne({ userId: req.user._id });

        if (!analytics) {
            return res.status(404).json({
                status: 'error',
                message: 'No analytics data found'
            });
        }

        res.json({
            status: 'success',
            data: {
                bestTimes: analytics.instagram.bestTimes
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.getHashtagAnalytics = async (req, res) => {
    try {
        const analytics = await Analytics.findOne({ userId: req.user._id });

        if (!analytics) {
            return res.status(404).json({
                status: 'error',
                message: 'No analytics data found'
            });
        }

        res.json({
            status: 'success',
            data: {
                topHashtags: analytics.instagram.topHashtags
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};