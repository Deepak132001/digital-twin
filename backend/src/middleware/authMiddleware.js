// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User no longer exists'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};