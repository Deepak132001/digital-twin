// backend/src/routes/instagram.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const instagramController = require('../controllers/instagramController');

router.use(protect);

router.post('/connect', instagramController.connectInstagram);
router.post('/sync', instagramController.syncInstagramData);
router.get('/profile', instagramController.getProfile);

module.exports = router;