// backend/src/routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get dashboard statistics
router.get('/dashboard', analyticsController.getDashboardStats);

// Get engagement metrics
router.get('/engagement', analyticsController.getEngagementMetrics);

// Get best posting times
router.get('/best-times', analyticsController.getBestPostingTimes);

// Get hashtag analytics
router.get('/hashtags', analyticsController.getHashtagAnalytics);

module.exports = router;