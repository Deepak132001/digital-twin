// backend/src/services/instagramService.js
const axios = require('axios');
const config = require('../config/environment');

class InstagramService {
    constructor() {
        this.baseUrl = 'https://graph.instagram.com';
        this.version = 'v18.0';
    }

    async getUserProfile(accessToken) {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.version}/me`, {
                params: {
                    fields: 'id,username,account_type,media_count',
                    access_token: accessToken
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch Instagram profile');
        }
    }

    async getMediaData(accessToken) {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.version}/me/media`, {
                params: {
                    fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
                    access_token: accessToken
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch Instagram media');
        }
    }

    async getInsights(accessToken, mediaId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.version}/${mediaId}/insights`, {
                params: {
                    metric: 'engagement,impressions,reach,saved',
                    access_token: accessToken
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch media insights');
        }
    }
}

module.exports = new InstagramService();