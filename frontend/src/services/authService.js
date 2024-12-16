// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });
  
      if (response.data.data.token) {
        // Initialize user with empty instagram object
        const user = {
          ...response.data.data.user,
          instagram: {
            connected: false
          }
        };
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(user));
      }
  
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to register';
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
  }
};

export default authService;