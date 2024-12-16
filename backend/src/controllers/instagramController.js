// backend/src/controllers/instagramController.js
const instagramService = require('../services/instagramService');
const User = require('../models/User');

exports.connectInstagram = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user._id);

        // Exchange code for access token
        const tokenData = await instagramService.exchangeCodeForToken(code);
        
        // Get Instagram profile data
        const profile = await instagramService.getUserProfile(tokenData.access_token);
        
        // Update user's Instagram connection
        user.instagram = {
            connected: true,
            accessToken: tokenData.access_token,
            userId: profile.id,
            username: profile.username,
            stats: {
                posts: profile.media_count
            },
            lastSync: new Date()
        };

        await user.save();

        res.json({
            status: 'success',
            message: 'Instagram connected successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.syncInstagramData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.instagram?.connected) {
            return res.status(400).json({
                status: 'error',
                message: 'Instagram not connected'
            });
        }

        // Fetch latest media data
        const mediaData = await instagramService.getMediaData(user.instagram.accessToken);
        
        // Get insights for each post
        const postsWithInsights = await Promise.all(
            mediaData.data.map(async (post) => {
                const insights = await instagramService.getInsights(
                    user.instagram.accessToken, 
                    post.id
                );
                return { ...post, insights };
            })
        );

        // Update user's Instagram data
        user.instagram.lastSync = new Date();
        await user.save();

        res.json({
            status: 'success',
            data: postsWithInsights
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};