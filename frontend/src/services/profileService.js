// src/services/profileService.js
import axiosInstance from './axiosConfig';

const profileService = {
    async updateProfile(userData) {
        try {
            const response = await axiosInstance.put('/user/profile', userData);
            
            // Make sure we're returning the entire response
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    async changePassword(passwordData) {
        try {
            const response = await axiosInstance.put('/user/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to change password');
        }
    }
};

export default profileService;