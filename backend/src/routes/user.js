// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
// router.use(authenticateToken);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user settings
router.put('/settings', userController.updateSettings);

// Get user analytics
router.get('/analytics', userController.getAnalytics);

// Get user posts
router.get('/posts', userController.getPosts);

// Update user profile
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

module.exports = router;