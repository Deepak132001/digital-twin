// src/services/instagramService.js
import axiosInstance from './axiosConfig';

const instagramService = {
  async getAuthUrl() {
    const response = await axiosInstance.get('/instagram/auth-url');
    return response.data;
  },

  async getProfile() {
    const response = await axiosInstance.get('/instagram/profile');
    return response.data;
  },

  async syncData() {
    const response = await axiosInstance.post('/instagram/sync');
    return response.data;
  },

  async getInsights() {
    const response = await axiosInstance.get('/instagram/insights');
    return response.data;
  },

  async disconnectInstagram() {
    const response = await axiosInstance.post('/instagram/disconnect');
    return response.data;
  }
};

export default instagramService;