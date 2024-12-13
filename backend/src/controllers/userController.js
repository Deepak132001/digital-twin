// backend/src/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Post = require('../models/Post');
const logger = require('../utils/logger');


exports.updateProfile = async (req, res) => {
  try {
      const { username, email } = req.body;
      console.log('Received update request:', { username, email });
      console.log('Current user ID:', req.user._id);
      
      // Check if email is already taken
      if (email !== req.user.email) {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
              return res.status(400).json({
                  status: 'error',
                  message: 'Email already in use'
              });
          }
      }

      // Update user with logging
      console.log('Attempting to update user with ID:', req.user._id);
      const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { username, email },
          { new: true, runValidators: true }
      ).select('-password');

      console.log('Updated user:', updatedUser);

      if (!updatedUser) {
          return res.status(404).json({
              status: 'error',
              message: 'User not found'
          });
      }

      res.json({
          status: 'success',
          data: {
              user: {
                  id: updatedUser._id,
                  username: updatedUser.username,
                  email: updatedUser.email
              }
          }
      });
  } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
          status: 'error',
          message: 'Failed to update profile'
      });
  }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Get user with password
        const user = await User.findById(req.user._id).select('+password');
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                error: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Failed to change password'
        });
    }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-accessToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ error: 'Settings data is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings } },
      { new: true }
    ).select('settings');

    res.json(user.settings);
  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(500).json({ error: 'Error updating settings' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('analytics');
    
    res.json(user.analytics);
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find({ userId: req.user._id })
      .sort({ postedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Post.countDocuments({ userId: req.user._id });

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    logger.error('Get posts error:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          'profile.name': name,
          'profile.bio': bio
        } 
      },
      { new: true }
    ).select('profile');

    res.json(user.profile);
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};