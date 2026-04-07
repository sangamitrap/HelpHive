# HelpHive - Hyperlocal Help Exchange Platform

A modern, responsive React + Vite + Tailwind CSS web application for connecting neighbors and building stronger communities through hyperlocal help exchange.

## Features

### ✨ Core Features

1. **Authentication**
   - Combined Login/Signup form
   - Form validation (email, password match, required fields)
   - Temporary user storage via state
   - Clean card-based design

2. **User Status Toggle**
   - Three states: OFF, "Need Help" (Red), "Willing to Help" (Green)
   - Color-coded visual indicators
   - Real-time UI updates
   - Status persistence in state

3. **Location Access**
   - Browser Geolocation API integration
   - Location permission requests
   - Shows latitude, longitude, and accuracy
   - Fallback UI when location is disabled

4. **Dashboard**
   - Displays nearby users/posts
   - User cards with name, status, distance, and action buttons
   - Status toggle and location indicator
   - Mock data for 6+ nearby users

5. **Chat Interface**
   - One-to-one messaging with message bubbles
   - Left/right message alignment
   - Message timestamps
   - Auto-scroll to latest message
   - Simulated responses

6. **Profile Section**
   - Display user details (name, email, phone, address)
   - Color-coded status display
   - Edit mode with form validation
   - Stats section (help requests, offers, connections)

7. **UI/UX**
   - Clean, modern design
   - Tailwind CSS styling
   - Mobile responsive
   - Toast notifications
   - Consistent color system:
     - Red (#ef4444) = Need Help
     - Green (#22c55e) = Helping
     - Grey (#9ca3af) = Offline

## Project Structure

```
HelpHive/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatusToggle.jsx
│   │   │   ├── LocationStatus.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── RequestCard.jsx
│   │   │   ├── HelpRequestForm.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/
│   │   │   └── useStore.js (Zustand store)
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── node_modules/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Request.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── requests.js
│   │   └── chats.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── dist/ (frontend build output)
├── README.md
├── setup.md
└── other documentation files...
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/helphive
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5174
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Quick Start (Recommended)

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

This will start both the backend server (http://localhost:5000) and frontend dev server (http://localhost:5173) simultaneously.

### Manual Setup

If you prefer to run services separately, follow the Backend Setup and Frontend Setup sections above.

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/dist/` directory.

### Backend Production
```bash
cd backend
npm start
```

For production deployment, you'll need to serve the frontend build files from the backend or a web server.

## Testing the App

### Demo Credentials
- Email: `test@example.com`
- Password: `password123` (minimum 6 characters)
- Or use any email/password combination for testing

### Features to Try

1. **Sign Up** → Create a new account with your details
2. **Dashboard** → View nearby users and your status
3. **Toggle Status** → Switch between "Need Help" and "Willing to Help"
4. **Geolocation** → Allow browser location access to see coordinates
5. **User Cards** → Click "Offer Help" or "Request Help" to start chatting
6. **Chat** → Send messages and receive simulated responses
7. **Profile** → View and edit your account details
8. **Notifications** → See toast notifications for status changes

## Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React
- **JavaScript:** ES6+

## State Management

The app uses **Zustand** for global state management:

```javascript
// User state
- user: Current logged-in user
- setUser: Update user

// Status state
- status: 'off', 'need-help', 'helping'
- setStatus: Update status

// Location state
- location: { latitude, longitude, accuracy }
- locationError: Error message or null

// Chat state
- chats: Array of chat objects
- currentChatId: Active chat ID
- addMessage: Add message to chat
- initChat: Initialize new chat

// Notifications
- notifications: Array of notification objects
- addNotification: Add notification
- removeNotification: Remove notification

// Nearby users
- nearbyUsers: Array of user objects
- setNearbyUsers: Update nearby users
```

## Available Routes

- `/` - Authentication (Login/Signup)
- `/dashboard` - Main dashboard with nearby users
- `/chat` - One-to-one chat interface
- `/profile` - User profile and settings

## Mock Data

The app includes mock data for:
- 6 nearby users with various statuses
- Chat messages for testing
- Mock API services for auth, location, and notifications

## Future Backend Integration

The code is structured for easy backend integration:

1. **Authentication** - Replace `mockAuthService` with real API calls
2. **Real-time Updates** - Add Socket.IO for live status and chat updates
3. **Location Services** - Integrate with backend location service
4. **Database** - Connect to backend database for persistent storage
5. **Notifications** - Implement push notifications using web sockets

## Code Quality

- Clean, modular component structure
- Reusable components and utilities
- Proper separation of concerns
- Consistent naming conventions
- Good error handling
- Responsive design from mobile to desktop

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Geolocation API support

## Notes

- All user data is stored in component state (not persisted)
- Mock API calls simulate real backend responses
- Chat messages are simulated and not stored persistently
- Geolocation requires HTTPS in production (or localhost in development)

## License

MIT

---

Built with ❤️ for the HelpHive community
