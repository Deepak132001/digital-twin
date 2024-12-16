// backend/src/controllers/authController.js
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
  
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email or username already exists'
        });
      }
  
      // Create user
      const user = await User.create({
        username,
        email,
        password
      });
  
      // Generate token
      const token = user.generateAuthToken();
  
      // Remove password from response
      user.password = undefined;
  
      res.status(201).json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred during registration'
      });
    }
  };

  
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email and password exist
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide email and password'
        });
      }
  
      // Find user and include password
      const user = await User.findOne({ email }).select('+password');
  
      // Check if user exists and password is correct
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          status: 'error',
          message: 'Incorrect email or password'
        });
      }
  
      // Generate token
      const token = user.generateAuthToken();
  
      // Remove password from response
      user.password = undefined;
  
      res.json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred during login'
      });
    }
  };
  

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};