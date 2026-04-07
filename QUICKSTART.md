# HelpHive - Quick Start Guide

## ⚡ Get Started in 2 Minutes

### 1. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### 2. Try the Demo
- **Email:** Use any email (e.g., `test@example.com`)
- **Password:** Any password with 6+ characters
- **Other fields:** Fill in any information (it's all mock data)

### 3. Explore Features

#### Authentication Page (/)
- Try signing up with any valid email/password
- Form validation works for all fields
- Click "Sign In" to switch to login mode

#### Dashboard (/dashboard)
- View 6 mock nearby users
- Toggle your status using the 3 buttons:
  - ⊘ **Offline** (grey) - You're not active
  - 🆘 **Need Help** (red) - You need assistance
  - 🤝 **Helping** (green) - You're available to help
- Check your **Location Status**:
  - Click "Retry" to request geolocation permission
  - Shows latitude, longitude, and accuracy when enabled

#### Chat Page (/chat)
- Click "Offer Help" or "Request Help" on any user card
- Chat bubbles appear with left/right alignment
- Type a message and press "Send"
- Simulated responses appear automatically

#### Profile Page (/profile)
- See all your account information
- Click "Edit" to modify your details
- View stats (currently showing 0 as mock values)
- Learn about HelpHive

### 4. What's Included

✅ **Full Authentication System**
- Login/Signup combined form
- Form validation
- User state management

✅ **Status Management**
- Toggle between 3 states
- Color-coded indicators
- Toast notifications

✅ **Location Features**
- Browser Geolocation API
- Permission handling
- Coordinate display

✅ **Feed System**
- 6 mock nearby users (sortable by distance)
- User cards with details
- Action buttons

✅ **Chat System**
- One-to-one messaging
- Message bubbles
- Auto-scroll
- Timestamps
- Simulated responses

✅ **Profile Management**
- User details display
- Edit mode
- Stats section

✅ **UI Components**
- Responsive navbar
- Toast notifications
- Loading states
- Error handling

## 📁 File Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.jsx
│   ├── StatusToggle.jsx
│   ├── LocationStatus.jsx
│   ├── UserCard.jsx
│   └── Toast.jsx
│
├── pages/            # Full page components
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   ├── Chat.jsx
│   └── Profile.jsx
│
├── store/            # Zustand state management
│   └── useStore.js
│
├── services/         # Mock APIs & data
│   └── mockData.js
│
└── App.jsx          # Main app with routing
```

## 🎨 Tailwind CSS Colors

- **Red (Help):** `#ef4444` - When user needs help
- **Green (Helping):** `#22c55e` - When user is helping
- **Grey (Offline):** `#9ca3af` - When user is offline

## 🔧 Tech Stack

- React 18
- Vite (super fast!)
- Tailwind CSS (modern styling)
- Zustand (state management)
- React Router (navigation)
- Lucide React (icons)

## 🚀 Ready for Backend?

The code is structured for easy backend integration:

1. Replace mock API calls in `src/services/mockData.js`
2. Connect real authentication endpoints
3. Integrate real-time updates with Socket.IO
4. Connect to your database
5. Add push notifications

All components are ready - just swap the mock data!

## 💡 Tips

- **Test geolocation:** Allow location permission in the popup
- **Test chat:** Click any "Offer Help" or "Request Help" button
- **Test notifications:** Change your status to see toast messages
- **Test responsive:** Resize browser window - it's fully mobile responsive!

## 📝 Notes

- All data is temporary (cleared on page refresh)
- Mock data is in `src/services/mockData.js`
- State is managed globally with Zustand
- No backend required - it's all frontend!

## 🎯 Next Steps

1. Run `npm run dev`
2. Open http://localhost:5173
3. Sign up with any email/password
4. Explore the dashboard, chat, and profile
5. Check out the code for backend integration points

Happy coding! 🐝
