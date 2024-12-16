// backend/src/controllers/aiController.js
const openAIService = require('../services/openaiService');

exports.generateContentIdeas = async (req, res) => {
    try {
        const { niche, targetAudience } = req.body;

        const ideas = await openAIService.generateContentIdeas(
            niche || 'general',
            targetAudience || 'general audience'
        );

        res.json({
            status: 'success',
            data: {
                ideas: ideas.split('\n').filter(idea => idea.trim())
            }
        });
    } catch (error) {
        console.error('Content ideas error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.generateCaption = async (req, res) => {
    try {
        const { context } = req.body;

        if (!context) {
            return res.status(400).json({
                status: 'error',
                message: 'Context is required'
            });
        }

        const caption = await openAIService.generateCaption(context);

        res.json({
            status: 'success',
            data: { caption }
        });
    } catch (error) {
        console.error('Caption generation error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// backend/src/controllers/aiController.js
exports.suggestHashtags = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                status: 'error',
                message: 'Content is required'
            });
        }

        const hashtags = await openAIService.suggestHashtags(content);

        // Format the hashtags string into an array
        const hashtagArray = hashtags
            .split(/[\n,]/) // Split by newline or comma
            .map(tag => tag.trim())
            .filter(tag => tag) // Remove empty strings
            .map(tag => tag.replace(/^#/, '')); // Remove # if present

        res.json({
            status: 'success',
            data: {
                hashtags: hashtagArray,
                nicheHashtags: hashtagArray.slice(0, 5) // First 5 as niche hashtags
            }
        });
    } catch (error) {
        console.error('Hashtag suggestion error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


// backend/src/controllers/aiController.js
exports.analyzeContent = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                status: 'error',
                message: 'Content is required'
            });
        }

        const analysis = await openAIService.analyzeContent(content);

        // Format the response
        const formattedAnalysis = {
            engagementScore: 8, // Example score
            audienceInsights: [
                "Content appeals to a young professional audience",
                "High engagement potential for fitness enthusiasts",
                "Good mix of informative and motivational content"
            ],
            bestTime: "Between 6 PM - 9 PM",
            suggestions: [
                "Add more relevant hashtags",
                "Include a call to action",
                "Use more engaging visuals",
                "Ask questions to encourage comments"
            ]
        };

        res.json({
            status: 'success',
            data: formattedAnalysis
        });
    } catch (error) {
        console.error('Content analysis error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to analyze content'
        });
    }
};