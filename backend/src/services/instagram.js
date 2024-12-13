// backend/src/services/instagram.js
const axios = require('axios');
const logger = require('../utils/logger');

const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v12.0';

class InstagramService {
  constructor() {
    this.baseURL = INSTAGRAM_API_BASE;
  }

  async fetchUserData(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/me`, {
        params: {
          fields: 'id,username,account_type,media_count,followers_count,follows_count',
          access_token: accessToken
        }
      });

      return {
        followers: response.data.followers_count,
        following: response.data.follows_count,
        posts: response.data.media_count
      };
    } catch (error) {
      logger.error('Error fetching Instagram user data:', error);
      return null;
    }
  }

  async fetchUserMedia(accessToken, limit = 25) {
    try {
      const response = await axios.get(`${this.baseURL}/me/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
          limit,
          access_token: accessToken
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching Instagram media:', error);
      return [];
    }
  }

  async fetchMediaInsights(mediaId, accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/${mediaId}/insights`, {
        params: {
          metric: 'engagement,impressions,reach,saved',
          access_token: accessToken
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching media insights:', error);
      return null;
    }
  }

  async refreshToken(oldAccessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/refresh_access_token`, {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: oldAccessToken
        }
      });

      return response.data.access_token;
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      throw error;
    }
  }
}

module.exports = new InstagramService();