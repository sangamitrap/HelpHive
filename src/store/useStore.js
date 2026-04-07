import { create } from 'zustand';

export const useStore = create((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Status state: 'off', 'need-help', 'helping'
  status: 'off',
  setStatus: (status) => set({ status }),

  // Location state
  location: null,
  locationError: null,
  setLocation: (location) => set({ location }),
  setLocationError: (error) => set({ locationError: error }),

  // Chat state
  chats: [],
  currentChatId: null,
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addMessage: (chatId, message) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, message] }
        : chat
    ),
  })),
  initChat: (userId, userName) => set((state) => {
    const chatId = `chat-${userId}-${Date.now()}`;
    const newChat = {
      id: chatId,
      userId,
      userName,
      userStatus: 'helping',
      messages: [],
      createdAt: new Date(),
    };
    return { chats: [...state.chats, newChat], currentChatId: chatId };
  }),

  // Nearby users (mock data)
  nearbyUsers: [],
  setNearbyUsers: (users) => set({ nearbyUsers: users }),

  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}));
