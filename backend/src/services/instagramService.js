// backend/src/services/instagramService.js
const axios = require('axios');
const logger = require('../utils/logger');

class InstagramService {
  constructor() {
    this.clientId = process.env.INSTAGRAM_CLIENT_ID;
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    this.graphApiVersion = 'v18.0'; // Latest stable version
    this.baseUrl = `https://graph.facebook.com/${this.graphApiVersion}`;
  }

  getRedirectUri(req) {
    const host = req.get('host');
    const protocol = req.protocol;
    const redirectUri = `${protocol}://${host}/api/instagram/callback`;
    logger.info('Generated Instagram redirect URI:', redirectUri);
    return redirectUri;
  }

  getAuthUrl(userId, req) {
    const state = Buffer.from(JSON.stringify({ 
      userId,
      redirectUrl: process.env.FRONTEND_URL 
    })).toString('base64');

    const redirectUri = this.getRedirectUri(req);
    
    // Updated for Instagram Graph API
    const authUrl = `https://www.facebook.com/${this.graphApiVersion}/dialog/oauth?` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement&` +
      `response_type=code&` +
      `state=${state}`;

    logger.info('Generated Facebook auth URL:', {
      userId,
      redirectUri,
      authUrl
    });

    return authUrl;
  }

  async exchangeCodeForToken(code, req) {
    try {
      const redirectUri = this.getRedirectUri(req);
      logger.info('Exchanging code for token with redirect URI:', redirectUri);
      
      // First, exchange code for short-lived access token
      const tokenResponse = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: redirectUri,
          code: code
        }
      });

      // Exchange short-lived token for long-lived token
      const longLivedTokenResponse = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          fb_exchange_token: tokenResponse.data.access_token
        }
      });

      logger.info('Successfully exchanged code for long-lived token');
      return {
        access_token: longLivedTokenResponse.data.access_token,
        token_type: longLivedTokenResponse.data.token_type,
        expires_in: longLivedTokenResponse.data.expires_in
      };
    } catch (error) {
      logger.error('Token exchange error:', {
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      throw new Error('Failed to exchange code for token');
    }
  }

  async getConnectedAccounts(accessToken) {
    try {
      // Get Facebook pages first
      const pagesResponse = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: { access_token: accessToken }
      });

      const accounts = [];
      for (const page of pagesResponse.data.data) {
        try {
          // Get Instagram business account connected to each page
          const instagramResponse = await axios.get(
            `${this.baseUrl}/${page.id}`,
            {
              params: {
                fields: 'connected_instagram_account',
                access_token: page.access_token
              }
            }
          );

          if (instagramResponse.data.connected_instagram_account) {
            accounts.push({
              pageId: page.id,
              pageName: page.name,
              pageAccessToken: page.access_token,
              instagramAccountId: instagramResponse.data.connected_instagram_account.id
            });
          }
        } catch (err) {
          logger.error(`Error getting Instagram account for page ${page.id}:`, err);
        }
      }

      return accounts;
    } catch (error) {
      logger.error('Error getting connected accounts:', error);
      throw new Error('Failed to get connected Instagram accounts');
    }
  }

  async getInstagramBusinessAccount(accessToken, instagramAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramAccountId}`, {
        params: {
          fields: 'id,username,profile_picture_url,followers_count,follows_count,media_count,biography',
          access_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching Instagram business account:', error);
      throw new Error('Failed to fetch Instagram business account details');
    }
  }

  async getMediaInsights(accessToken, instagramAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramAccountId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          access_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching media insights:', error);
      throw new Error('Failed to fetch media insights');
    }
  }
}

module.exports = new InstagramService();