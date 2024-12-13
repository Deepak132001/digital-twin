// backend/src/config/passport.js
const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const config = require('./environment');
const User = require('../models/User');
const logger = require('../utils/logger');
const { fetchInstagramUserData } = require('../services/instagram');

module.exports = () => {
  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Instagram Strategy
  passport.use(new InstagramStrategy({
    clientID: config.INSTAGRAM.CLIENT_ID,
    clientSecret: config.INSTAGRAM.CLIENT_SECRET,
    callbackURL: config.INSTAGRAM.CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ instagramId: profile.id });

      if (user) {
        // Update existing user
        user.accessToken = accessToken;
        user.profile.name = profile.displayName;
        user.lastAnalyzed = new Date();
        
        // Fetch latest Instagram data
        const instagramData = await fetchInstagramUserData(accessToken);
        if (instagramData) {
          user.profile = {
            ...user.profile,
            ...instagramData
          };
        }

        await user.save();
        return done(null, user);
      }

      // Create new user
      const instagramData = await fetchInstagramUserData(accessToken);
      
      user = await User.create({
        instagramId: profile.id,
        username: profile.username,
        accessToken: accessToken,
        profile: {
          name: profile.displayName,
          bio: profile._json?.bio || '',
          profilePicture: profile._json?.profile_picture || '',
          ...instagramData
        },
        settings: {
          proactiveNotifications: true,
          commentReplySuggestions: true,
          trendAlerts: true,
          postingTimeAlerts: true
        },
        analytics: {
          bestPostingTimes: [],
          topHashtags: [],
          averageEngagement: 0
        }
      });

      return done(null, user);
    } catch (error) {
      logger.error('Passport strategy error:', error);
      return done(error, null);
    }
  }));
};