// Mock data for nearby users
export const mockNearbyUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    status: 'need-help',
    distance: 0.5,
    category: 'Electronics Repair',
    image: '👩‍💼',
    description: 'Need help fixing my laptop',
  },
  {
    id: '2',
    name: 'Mike Chen',
    status: 'helping',
    distance: 1.2,
    category: 'Plumbing',
    image: '👨‍🔧',
    description: 'Available for plumbing help',
  },
  {
    id: '3',
    name: 'Emma Davis',
    status: 'need-help',
    distance: 0.8,
    category: 'Gardening',
    image: '👩‍🌾',
    description: 'Looking for gardening assistance',
  },
  {
    id: '4',
    name: 'Alex Kumar',
    status: 'helping',
    distance: 2.1,
    category: 'Tutoring',
    image: '👨‍🏫',
    description: 'Offering math tutoring',
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    status: 'need-help',
    distance: 1.5,
    category: 'Moving Help',
    image: '👩‍💪',
    description: 'Need help with moving boxes',
  },
  {
    id: '6',
    name: 'James Wilson',
    status: 'helping',
    distance: 0.3,
    category: 'Dog Walking',
    image: '👨‍🦰',
    description: 'Dog walking and pet care',
  },
];

// Mock initial chat messages
export const mockChatMessages = [
  {
    id: '1',
    senderId: 'user',
    text: 'Hi! Can you help me with my laptop?',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '2',
    senderId: 'other',
    text: 'Sure! What seems to be the problem?',
    timestamp: new Date(Date.now() - 4 * 60000),
  },
  {
    id: '3',
    senderId: 'user',
    text: 'It won\'t turn on anymore',
    timestamp: new Date(Date.now() - 3 * 60000),
  },
  {
    id: '4',
    senderId: 'other',
    text: 'I can take a look. How about tomorrow evening?',
    timestamp: new Date(Date.now() - 2 * 60000),
  },
];

// Mock API services
export const mockAuthService = {
  signup: async (data) => {
    console.log('Mock signup:', data);
    return {
      success: true,
      user: {
        id: 'user-' + Date.now(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    };
  },

  login: async (email, password) => {
    console.log('Mock login:', email);
    return {
      success: true,
      user: {
        id: 'user-123',
        fullName: 'John Doe',
        email: email,
        phone: '+1234567890',
        address: '123 Main St, City, Country',
      },
    };
  },
};

export const mockLocationService = {
  getLocation: () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  },
};

export const mockNotificationService = {
  sendNotification: async (message) => {
    console.log('Mock notification:', message);
    return { success: true };
  },
};
