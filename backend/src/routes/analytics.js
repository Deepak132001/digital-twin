// backend/src/routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get overall analytics
router.get('/overview', analyticsController.getOverview);

// Get engagement metrics
router.get('/engagement', analyticsController.getEngagementMetrics);

// Get best posting times
router.get('/posting-times', analyticsController.getBestPostingTimes);

// Get hashtag performance
router.get('/hashtags', analyticsController.getHashtagPerformance);

// Get audience insights
router.get('/audience', analyticsController.getAudienceInsights);

// Get content performance
router.get('/content', analyticsController.getContentPerformance);

// Generate analytics report
router.post('/report', analyticsController.generateReport);

module.exports = router;