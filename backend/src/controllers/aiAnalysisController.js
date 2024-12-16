// backend/src/controllers/aiAnalysisController.js
const AIAnalysisService = require('../services/aiAnalysisService');
const User = require('../models/User');

exports.getProfileAnalysis = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user.instagram?.connected) {
            return res.status(400).json({
                status: 'error',
                message: 'Instagram account not connected'
            });
        }

        const analysis = await AIAnalysisService.analyzeInstagramProfile(user);

        res.json({
            status: 'success',
            data: analysis
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.generateContentSuggestions = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user.instagram?.connected) {
            return res.status(400).json({
                status: 'error',
                message: 'Instagram account not connected'
            });
        }

        const suggestions = await AIAnalysisService.generateContentSuggestions(user);

        res.json({
            status: 'success',
            data: suggestions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};