// backend/src/controllers/userController.js
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        // Send response
        res.json({
            status: 'success',
            data: {
                user: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    instagram: updatedUser.instagram
                }
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update profile'
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user._id).select('+password');
        
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({
                status: 'error',
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};