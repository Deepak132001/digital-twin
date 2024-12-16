// backend/src/routes/ai.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

// All routes need authentication
router.use(protect);

// Generate content ideas
router.post('/content-ideas', aiController.generateContentIdeas);

// Generate caption
router.post('/generate-caption', aiController.generateCaption);

// Suggest hashtags
router.post('/suggest-hashtags', aiController.suggestHashtags);

router.post('/analyze-content', aiController.analyzeContent);

module.exports = router;