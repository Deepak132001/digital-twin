// src/services/aiService.js
import axiosInstance from './axiosConfig';

const aiService = {
  async generateContentIdeas(niche, targetAudience) {
    const response = await axiosInstance.post('/ai/content-ideas', {
      niche,
      targetAudience
    });
    return response.data;
  },

  async generateCaption(context) {
    const response = await axiosInstance.post('/ai/generate-caption', {
      context
    });
    return response.data;
  },

  async suggestHashtags(content) {
    const response = await axiosInstance.post('/ai/suggest-hashtags', {
      content
    });
    return response.data;
  },

  async analyzeContent(content) {
    const response = await axiosInstance.post('/ai/analyze-content', {
      content
    });
    return response.data;
  },
  async getProfileAnalysis() {
    const response = await axiosInstance.get('/ai/profile-analysis');
    return response.data;
  },

  async generateContentSuggestions() {
    const response = await axiosInstance.post('/ai/content-suggestions');
    return response.data;
  },

  async getEngagementOptimization() {
    const response = await axiosInstance.get('/ai/engagement-optimization');
    return response.data;
  },

  async analyzeBestTimes() {
    const response = await axiosInstance.get('/ai/best-times');
    return response.data;
  }
};

export default aiService;