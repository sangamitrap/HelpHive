// API Service for HelpHive backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('helphive_token');
  }

  // Set token
  setToken(token) {
    localStorage.setItem('helphive_token', token);
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('helphive_token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('[API] Fetch', { url, config });

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Failed to parse API response as JSON:', parseError, 'responseText:', text);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        const errorMessage = data.message || data.errors?.[0]?.msg || 'API request failed';
        console.error(`API Error [${response.status}] at ${endpoint}:`, errorMessage, data);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error.message, 'url:', url, 'config:', config);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateStatus(status) {
    return this.request('/auth/status', {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateLocation(locationData) {
    return this.request('/auth/location', {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  }

  // User methods
  async getNearbyUsers(longitude, latitude, radius = 5000) {
    return this.request(`/users/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`);
  }

  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  // Request methods
  async createRequest(requestData) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getRequests(type) {
    const query = type ? `?type=${type}` : '';
    return this.request(`/requests${query}`);
  }

  async updateRequest(requestId, updates) {
    return this.request(`/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getRequestById(requestId) {
    return this.request(`/requests/${requestId}`);
  }

  // Chat methods
  async getChats() {
    return this.request('/chats');
  }

  async getChatMessages(chatId) {
    return this.request(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId, content) {
    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async markMessagesAsRead(chatId) {
    return this.request(`/chats/${chatId}/read`, {
      method: 'PUT',
    });
  }

  // Utility methods
  logout() {
    this.removeToken();
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;