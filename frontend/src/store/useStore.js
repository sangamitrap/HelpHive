import { create } from 'zustand';
import apiService from '../services/api';

// Helper functions for localStorage (for offline data)
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const useStore = create((set, get) => ({
  // User state - now loaded from API
  user: null,
  isLoading: false,
  error: null,

  // Initialize user from API
  initializeUser: async () => {
    if (!apiService.isAuthenticated()) return;

    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getCurrentUser();
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize user:', error);
      apiService.logout(); // Clear invalid token
      set({ user: null, isLoading: false, error: error.message });
    }
  },

  // Auth actions
  login: async (credentials) => {
    console.log('[AUTH] Login attempt:', credentials.email);
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(credentials);
      console.log('[AUTH] Login successful');
      set({
        user: response.data.user,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      console.error('[AUTH] Login failed:', error.message);
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  register: async (userData) => {
    console.log('[AUTH] Register attempt:', userData.email);
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register(userData);
      console.log('[AUTH] Register successful');
      set({
        user: response.data.user,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      console.error('[AUTH] Register failed:', error.message);
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    apiService.logout();
    set({
      user: null,
      status: 'off',
      requests: [],
      chats: [],
      currentChatId: null,
      activeChatUser: null,
      notifications: []
    });
  },

  // Status state
  status: 'off',
  setStatus: async (newStatus) => {
    try {
      await apiService.updateStatus(newStatus);
      set({ status: newStatus });

      // Add notification
      get().addNotification({
        id: Date.now(),
        type: 'success',
        message: newStatus === 'need-help'
          ? '🔍 You are now looking for help!'
          : newStatus === 'helping'
          ? '✅ You are now available to help!'
          : '⚪ You are now offline',
        duration: 3000,
      });
    } catch (error) {
      get().addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Failed to update status',
        duration: 3000,
      });
    }
  },

  // Location state
  location: null,
  locationError: null,
  setLocation: async (location) => {
    set({ location });
    // Update location on backend
    try {
      await apiService.updateLocation({
        longitude: location.longitude,
        latitude: location.latitude,
        address: location.address || ''
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  },
  setLocationError: (error) => set({ locationError: error }),

  // Request management system - now API-based
  requests: [],
  setRequests: (requests) => set({ requests }),

  addRequest: async (requestData) => {
    try {
      const response = await apiService.createRequest(requestData);
      const newRequest = response.data.request;

      set((state) => ({
        requests: [...state.requests, newRequest]
      }));

      get().addNotification({
        id: Date.now(),
        type: 'success',
        message: `Help request sent successfully!`,
        duration: 3000,
      });

      return { success: true };
    } catch (error) {
      get().addNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Failed to send request',
        duration: 3000,
      });
      return { success: false, error: error.message };
    }
  },

  updateRequest: async (requestId, updates) => {
    try {
      const response = await apiService.updateRequest(requestId, updates);
      const updatedRequest = response.data.request;

      set((state) => ({
        requests: state.requests.map(req =>
          req.id === requestId ? updatedRequest : req
        )
      }));

      return { success: true };
    } catch (error) {
      get().addNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Failed to update request',
        duration: 3000,
      });
      return { success: false, error: error.message };
    }
  },

  loadRequests: async () => {
    try {
      const response = await apiService.getRequests();
      set({ requests: response.data });
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  },

  // Chat state
  chats: [],
  currentChatId: null,
  activeChatUser: null,
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setActiveChatUser: (user) => set({ activeChatUser: user }),

  loadChats: async () => {
    try {
      const response = await apiService.getChats();
      set({ chats: response.data });
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  },

  initChat: (userId, userName) => {
    // Find existing chat or create new one
    const state = get();
    const existingChat = state.chats.find(chat =>
      chat.userId === userId
    );

    if (existingChat) {
      set({
        currentChatId: existingChat.id,
        activeChatUser: { id: userId, name: userName }
      });
    } else {
      // For now, just set the active chat user
      // The chat will be created on the backend when request is accepted
      set({
        activeChatUser: { id: userId, name: userName }
      });
    }

    // Navigate to chat page
    window.location.href = '/chat';
  },

  addMessage: async (chatId, content) => {
    try {
      const response = await apiService.sendMessage(chatId, content);
      const newMessage = response.data.message;

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...(chat.messages || []), newMessage] }
            : chat
        ),
      }));

      return { success: true };
    } catch (error) {
      get().addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Failed to send message',
        duration: 3000,
      });
      return { success: false, error: error.message };
    }
  },

  // Nearby users (loaded from API)
  nearbyUsers: [],
  setNearbyUsers: async (longitude, latitude, radius = 5000) => {
    try {
      const response = await apiService.getNearbyUsers(longitude, latitude, radius);
      set({ nearbyUsers: response.data });
    } catch (error) {
      console.error('Failed to load nearby users:', error);
      // Fallback to mock data if API fails
      const { mockNearbyUsers } = await import('../services/mockData');
      set({ nearbyUsers: mockNearbyUsers });
    }
  },

  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  // Helper functions
  getSentRequests: () => {
    const { user, requests } = get();
    return requests.filter(req => req.requesterId === user?.id);
  },

  getReceivedRequests: () => {
    const { user, requests } = get();
    return requests.filter(req => req.helperId === user?.id);
  },

  getAcceptedRequest: () => {
    const { user, requests } = get();
    return requests.find(req =>
      (req.requesterId === user?.id || req.helperId === user?.id) &&
      req.status === 'accepted'
    );
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiService.updateProfile(userData);
      set({ user: response.data.user });

      get().addNotification({
        id: Date.now(),
        type: 'success',
        message: 'Profile updated successfully!',
        duration: 3000,
      });

      return { success: true };
    } catch (error) {
      get().addNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Failed to update profile',
        duration: 3000,
      });
      return { success: false, error: error.message };
    }
  },

  // Clear all data (for logout) - now just clear local state
  clearAll: () => {
    set({
      user: null,
      status: 'off',
      requests: [],
      chats: [],
      currentChatId: null,
      activeChatUser: null,
      notifications: [],
      nearbyUsers: []
    });
  }
}));
