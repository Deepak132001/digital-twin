// backend/src/routes/instagram.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const instagramController = require('../controllers/instagramController');

// OAuth callback - handles the OAuth flow
router.get('/callback', instagramController.handleCallback);

// Webhook endpoints
router.get('/webhook', instagramController.handleWebhookVerification);
router.post('/webhook', instagramController.handleWebhookUpdate);

// Protected routes
router.get('/auth-url', protect, instagramController.getAuthUrl);
router.post('/disconnect', protect, instagramController.disconnectInstagram);
router.post('/sync', protect, instagramController.syncInstagramData);

module.exports = router;