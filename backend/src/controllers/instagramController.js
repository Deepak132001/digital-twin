// backend/src/controllers/instagramController.js
const User = require('../models/User');
const instagramService = require('../services/instagramService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

exports.getAuthUrl = async (req, res, next) => {
  try {
    const authUrl = instagramService.getAuthUrl(req.user._id, req);
    res.json({ authUrl });
  } catch (error) {
    next(new AppError('Failed to generate auth URL', 500));
  }
};

exports.handleCallback = async (req, res, next) => {
  try {
    logger.info('Instagram callback received', {
      query: req.query,
      params: req.params
    });

    const { code, state } = req.query;

    // Check if there's an error from Facebook
    if (req.query.error) {
      logger.error('Facebook OAuth error:', {
        error_code: req.query.error_code,
        error_message: req.query.error_message
      });
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=error&reason=oauth_error`);
    }

    if (!code || !state) {
      logger.error('Missing code or state');
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=error&reason=missing_params`);
    }

    // Decode state parameter
    let decodedState;
    try {
      decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      logger.info('Decoded state:', decodedState);
    } catch (error) {
      logger.error('Error decoding state:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=error&reason=invalid_state`);
    }

    const { userId } = decodedState;

    // Exchange code for token
    const tokenData = await instagramService.exchangeCodeForToken(code, req);
    logger.info('Received token data');

    // Get connected accounts
    const connectedAccounts = await instagramService.getConnectedAccounts(tokenData.access_token);
    logger.info('Found connected accounts:', connectedAccounts);

    if (connectedAccounts.length === 0) {
      logger.error('No Instagram business accounts found');
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=error&reason=no_instagram_account`);
    }

    // Get the first Instagram business account
    const instagramAccount = await instagramService.getInstagramBusinessAccount(
      tokenData.access_token,
      connectedAccounts[0].instagramAccountId
    );

    // Update user with Instagram data
    const user = await User.findById(userId);
    if (!user) {
      logger.error('User not found:', userId);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=error&reason=user_not_found`);
    }

    user.instagram = {
      connected: true,
      accessToken: tokenData.access_token,
      userId: instagramAccount.id,
      username: instagramAccount.username,
      pageId: connectedAccounts[0].pageId,
      pageToken: connectedAccounts[0].pageAccessToken,
      stats: {
        followers: instagramAccount.followers_count,
        following: instagramAccount.follows_count,
        posts: instagramAccount.media_count
      },
      lastSync: new Date()
    };

    await user.save();
    logger.info('Successfully updated user with Instagram data');

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=connected`);
  } catch (error) {
    logger.error('Instagram callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=error&reason=server_error`);
  }
};

exports.disconnectInstagram = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.instagram = {
      connected: false,
      accessToken: null,
      userId: null,
      username: null,
      stats: null,
      lastSync: null
    };

    await user.save();

    res.json({
      status: 'success',
      message: 'Instagram disconnected successfully'
    });
  } catch (error) {
    next(new AppError('Failed to disconnect Instagram', 500));
  }
};

exports.syncInstagramData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.instagram?.connected) {
      throw new AppError('Instagram not connected', 400);
    }

    const mediaData = await instagramService.getMediaInsights(user.instagram.accessToken);
    
    user.instagram.lastSync = new Date();
    await user.save();

    res.json({
      status: 'success',
      data: mediaData
    });
  } catch (error) {
    next(new AppError('Failed to sync Instagram data', 500));
  }
};

exports.handleWebhookVerification = async (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    logger.info('Instagram Webhook verification request received:', {
      mode,
      token,
      challenge
    });

    // Check mode and token
    if (mode === 'subscribe' && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
      // Respond with the challenge code
      logger.info('Webhook verified successfully');
      return res.status(200).send(challenge);
    }

    // If token doesn't match or mode isn't subscribe
    logger.error('Webhook verification failed', {
      receivedToken: token,
      expectedToken: process.env.INSTAGRAM_VERIFY_TOKEN
    });
    return res.sendStatus(403);
  } catch (error) {
    logger.error('Webhook verification error:', error);
    return res.sendStatus(500);
  }
};

exports.handleWebhookUpdate = async (req, res) => {
  try {
    logger.info('Received webhook update:', req.body);
    return res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    logger.error('Error handling webhook update:', error);
    return res.sendStatus(500);
  }
};