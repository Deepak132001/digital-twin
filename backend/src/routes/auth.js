// backend/src/routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { protect } = require('../middleware/authMiddleware');

// Instagram OAuth routes
router.get('/instagram', passport.authenticate('instagram', { scope: ['basic'] }));

router.get(
  '/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  authController.instagramCallback
);

// Get current authenticated user
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getCurrentUser);


// Logout route
router.post('/logout', authenticateToken, (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;