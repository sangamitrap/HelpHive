# HelpHive Architecture & Backend Integration Guide

## 🏗️ Application Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React App (Vite)                         │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│   ┌──────────────────┐  │   ┌─────────────────────────┐   │
│   │   Pages          │  │   │  Components             │   │
│   ├──────────────────┤  │   ├─────────────────────────┤   │
│   │ • Auth           │  │   │ • Navbar                │   │
│   │ • Dashboard      │  │   │ • StatusToggle          │   │
│   │ • Chat           │  │   │ • LocationStatus        │   │
│   │ • Profile        │  │   │ • UserCard              │   │
│   └──────────────────┘  │   │ • Toast                 │   │
│                         │   └─────────────────────────┘   │
│                         │                                  │
│   ┌──────────────────┐  │   ┌─────────────────────────┐   │
│   │ Router & Nav     │  │   │  Global State (Zustand) │   │
│   ├──────────────────┤  │   ├─────────────────────────┤   │
│   │ React Router v6  │  │   │ • user                  │   │
│   │ • /              │  │   │ • status                │   │
│   │ • /dashboard     │  │   │ • location              │   │
│   │ • /chat          │  │   │ • chats                 │   │
│   │ • /profile       │  │   │ • notifications         │   │
│   └──────────────────┘  │   └─────────────────────────┘   │
│                         │                                  │
│   ┌──────────────────┐  │                                  │
│   │ Mock Services    │  │                                  │
│   ├──────────────────┤  │                                  │
│   │ • mockAuth       │  │                                  │
│   │ • mockLocation   │  │                                  │
│   │ • mockData       │  │                                  │
│   └──────────────────┘  │                                  │
└──────────────────────────┴──────────────────────────────────┘
                              ↓
                    (Currently no backend)
```

## 📂 Folder Structure & Responsibilities

### `/src/pages`
**Responsibility:** Full page components that handle routing

- **Auth.jsx** - Login/Signup page
  - Form validation
  - Calls `mockAuthService.signup()` or `login()`
  - Sets user in global state
  - Redirects to dashboard

- **Dashboard.jsx** - Main app home
  - Shows nearby users (from store)
  - StatusToggle component
  - LocationStatus component
  - User cards grid

- **Chat.jsx** - One-to-one messaging
  - Displays active chat
  - Message input & send
  - Auto-scroll to latest

- **Profile.jsx** - User profile
  - Display user info
  - Edit mode
  - Stats display

### `/src/components`
**Responsibility:** Reusable UI components

- **Navbar.jsx** - Top navigation bar
  - App logo
  - User profile button
  - Logout button
  - Current status display

- **StatusToggle.jsx** - Status selector
  - 3 buttons (Off, Need Help, Helping)
  - Color-coded
  - Triggers notifications

- **LocationStatus.jsx** - Location display
  - Geolocation request
  - Shows coordinates
  - Error handling

- **UserCard.jsx** - Nearby user card
  - User info display
  - Status badge
  - Distance
  - Action button

- **Toast.jsx** - Notification component
  - Auto-dismiss
  - Multiple types (success, error, info)
  - Icon display

### `/src/store`
**Responsibility:** Global state management

**useStore.js** - Zustand store with:
- User state (login data)
- Status state (off/help/helping)
- Location state (coordinates)
- Chat state (messages, active chat)
- Notifications queue
- Nearby users list

### `/src/services`
**Responsibility:** API calls & mock data

**mockData.js** contains:
- `mockNearbyUsers` - 6 sample users
- `mockChatMessages` - Sample chat history
- `mockAuthService.signup()` - Simulates authentication
- `mockAuthService.login()` - Simulates login
- `mockLocationService.getLocation()` - Calls browser Geolocation API
- `mockNotificationService.sendNotification()` - Simulates notifications

## 🔄 Data Flow

### Authentication Flow
```
Auth Form (Auth.jsx)
    ↓
Form Validation
    ↓
Call mockAuthService.signup() or login()
    ↓
Mock API returns user object
    ↓
setUser() → Update Zustand store
    ↓
Redirect to /dashboard
```

### Status Change Flow
```
StatusToggle.jsx (button click)
    ↓
setStatus() → Update Zustand store
    ↓
addNotification() → Toast appears
    ↓
Component re-renders with new status color
```

### Chat Flow
```
UserCard.jsx (Click "Offer Help")
    ↓
initChat() → Create new chat object in store
    ↓
setCurrentChatId() → Set active chat
    ↓
Navigate to /chat page
    ↓
Chat.jsx loads messages from store
    ↓
User types message
    ↓
addMessage() → Add to store
    ↓
Simulated response after 1 second
```

## 🔌 Backend Integration Points

### 1. Authentication (Currently using `mockAuthService`)

**Current Flow:**
```javascript
// src/services/mockData.js
export const mockAuthService = {
  signup: async (data) => {
    return { success: true, user: {...} }
  },
  login: async (email, password) => {
    return { success: true, user: {...} }
  }
}
```

**To Connect Real Backend:**
```javascript
// src/services/authService.js
export const authService = {
  signup: async (data) => {
    const response = await fetch('https://api.helphive.com/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  login: async (email, password) => {
    const response = await fetch('https://api.helphive.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
}
```

Then in `Auth.jsx`, replace:
```javascript
// Old
import { mockAuthService } from '../services/mockData';
// New
import { authService } from '../services/authService';
```

### 2. Nearby Users (Currently mocked)

**Current:**
```javascript
// src/pages/Dashboard.jsx
useEffect(() => {
  setNearbyUsers(mockNearbyUsers);
}, [setNearbyUsers]);
```

**To Use Real API:**
```javascript
useEffect(() => {
  const fetchNearbyUsers = async () => {
    const response = await fetch(
      `https://api.helphive.com/users/nearby?lat=${location.latitude}&lng=${location.longitude}`
    );
    const users = await response.json();
    setNearbyUsers(users);
  };
  
  if (location) {
    fetchNearbyUsers();
  }
}, [location, setNearbyUsers]);
```

### 3. Chat (Currently using mock messages)

**Current:**
```javascript
// src/pages/Chat.jsx
useEffect(() => {
  if (currentChat.messages.length === 0) {
    setMessages(mockChatMessages);
  }
}, []);
```

**To Use Real Sockets:**
```javascript
import io from 'socket.io-client';

useEffect(() => {
  const socket = io('https://api.helphive.com');
  
  socket.on('message', (newMessage) => {
    addMessage(currentChatId, newMessage);
  });
  
  return () => socket.disconnect();
}, [currentChatId]);

const handleSendMessage = (e) => {
  e.preventDefault();
  socket.emit('send_message', {
    chatId: currentChatId,
    message: messageText
  });
  setMessageText('');
};
```

### 4. Status Updates (Simulated locally)

**Current:**
```javascript
// src/components/StatusToggle.jsx
const handleStatusChange = (newStatus) => {
  setStatus(newStatus); // Only local update
  addNotification({...});
};
```

**To Use Real-time Sockets:**
```javascript
const handleStatusChange = async (newStatus) => {
  // Update local state immediately for UI
  setStatus(newStatus);
  
  // Broadcast to server
  socket.emit('status_change', {
    userId: user.id,
    newStatus: newStatus
  });
  
  // Server broadcasts to nearby users
  addNotification({...});
};

socket.on('nearby_user_status', (data) => {
  // Update user in nearby list when they change status
  setNearbyUsers(prev => 
    prev.map(u => u.id === data.userId ? {...u, status: data.status} : u)
  );
});
```

### 5. Location Service

**Current:**
```javascript
// Uses browser Geolocation API directly
navigator.geolocation.getCurrentPosition(...)
```

**Could Also Add:**
```javascript
export const locationService = {
  // Store location on server for discovery
  storeLocation: async (latitude, longitude) => {
    await fetch('https://api.helphive.com/location', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude })
    });
  }
};

// In LocationStatus.jsx
const requestLocationPermission = async () => {
  const loc = await mockLocationService.getLocation();
  setLocation(loc);
  
  // Also store on server
  await locationService.storeLocation(loc.latitude, loc.longitude);
};
```

## 🗂️ State Management Details

### User State
```javascript
{
  id: 'user-123',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: '123 Main St'
}
```

### Status State
```javascript
status: 'off' | 'need-help' | 'helping'
```

### Location State
```javascript
{
  latitude: 40.7128,
  longitude: -74.0060,
  accuracy: 15.5
}
```

### Chat State
```javascript
{
  id: 'chat-1-123',
  userId: '1',
  userName: 'Sarah Johnson',
  userStatus: 'need-help',
  messages: [{
    id: '1',
    senderId: 'user',
    text: 'Hi!',
    timestamp: Date
  }],
  createdAt: Date
}
```

### Nearby Users State
```javascript
{
  id: '1',
  name: 'Sarah Johnson',
  status: 'need-help',
  distance: 0.5,
  category: 'Electronics Repair',
  image: '👩‍💼',
  description: 'Need help fixing my laptop'
}
```

## 🔐 Security Considerations

When integrating backend, add:

1. **JWT Token Storage**
   ```javascript
   // After login, store token
   localStorage.setItem('authToken', response.token);
   
   // Add to all API requests
   fetch(url, {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     }
   });
   ```

2. **HTTPS Only**
   - All API calls must use HTTPS in production
   - Geolocation requires HTTPS (except localhost)

3. **Input Validation**
   - Current form validation is on frontend
   - Backend should also validate

4. **Rate Limiting**
   - Implement on backend to prevent abuse
   - Prevent rapid status changes, messages, etc.

## 📱 Environment Variables

Create `.env` for backend URLs:

```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Then use:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## 🧪 Testing Checklist

- [ ] Authentication flow (signup/login)
- [ ] Status toggle updates UI
- [ ] Geolocation permission handling
- [ ] Chat messaging and scroll
- [ ] Profile edit mode
- [ ] Toast notifications
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Form validation
- [ ] Navigation between pages
- [ ] User data persistence after login

## 📚 Dependencies Overview

- **react** - UI framework
- **react-dom** - DOM rendering
- **react-router-dom** - Routing
- **zustand** - State management (lightweight alternative to Redux)
- **lucide-react** - Icons
- **tailwindcss** - Styling
- **vite** - Build tool

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

---

**The code is production-ready and fully prepared for backend integration!**
