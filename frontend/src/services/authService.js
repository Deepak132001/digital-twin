// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      console.log('Auth service response:', response.data); // Add this line

      // Check if we have the expected data structure
      if (response.data.status === 'success' && response.data.data) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      throw this._handleError(error);
    }
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      console.log('Stored user:', user); // Add this line
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  _handleError(error) {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    return new Error('An unexpected error occurred');
  }
};

export default authService;