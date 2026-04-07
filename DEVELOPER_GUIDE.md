# HelpHive Developer Guide

## 🎯 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Basic React knowledge
- Tailwind CSS understanding (optional)

### Setup (2 Steps)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in your browser.

---

## 📚 Understanding the Codebase

### Entry Point

**index.html** → **src/main.jsx** → **src/App.jsx**

```
index.html (DOM root)
    ↓
main.jsx (React root render)
    ↓
App.jsx (Router + Routes)
    ↓
Pages & Components
```

### App.jsx - The Core

```javascript
// Main application component
// Handles:
// 1. Router setup (BrowserRouter)
// 2. Routes definition
// 3. Toast notification display
// 4. Navbar visibility (only when user logged in)
```

**Key features:**
- Watches notifications from store
- Converts notifications to toasts
- Manages toast lifecycle
- Routes to appropriate page

### Store (Zustand) - State Management

Located: `src/store/useStore.js`

**Why Zustand?**
- Lightweight (just 2KB)
- Simple API
- No boilerplate like Redux
- Perfect for medium-sized apps

**How to use:**
```javascript
import { useStore } from '../store/useStore';

function MyComponent() {
  // Get state and actions
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  // Or get multiple at once
  const { user, status, setStatus } = useStore();
}
```

**Store Structure:**
```javascript
{
  // User
  user: null,
  setUser: fn,
  
  // Status ('off', 'need-help', 'helping')
  status: 'off',
  setStatus: fn,
  
  // Location
  location: null,
  locationError: null,
  setLocation: fn,
  setLocationError: fn,
  
  // Chat
  chats: [],
  currentChatId: null,
  setCurrentChatId: fn,
  addMessage: fn,
  initChat: fn,
  
  // Nearby users
  nearbyUsers: [],
  setNearbyUsers: fn,
  
  // Notifications
  notifications: [],
  addNotification: fn,
  removeNotification: fn,
}
```

---

## 🔍 Component Deep Dives

### Components Directory

#### Navbar.jsx
```
Props: None (uses store directly)
Purpose: Top navigation bar
Displays: Logo, user profile, logout, status badge

Key Logic:
- Shows user name and status
- Logout returns to login page
- Only visible when logged in
```

Usage:
```javascript
// In App.jsx
{user && <Navbar />}
```

#### StatusToggle.jsx
```
Props: None (uses store directly)
Purpose: 3-button status selector
States: Off (grey), Need Help (red), Helping (green)

Key Logic:
- Calls setStatus() on button click
- Triggers notification on status change
- Shows status description below buttons
```

Styling:
- Uses dynamic className based on current status
- Tailwind color classes: bg-red-500, bg-green-500, etc.

#### LocationStatus.jsx
```
Props: None (uses store directly)
Purpose: Geolocation display and permission request
Shows: Coordinates, accuracy, error handling

Key Logic:
1. useEffect on mount: Request location
2. Uses mockLocationService.getLocation()
3. Handles permission denial gracefully
4. Shows retry button if failed

Location Data Stored:
{
  latitude: number,
  longitude: number,
  accuracy: number (meters)
}
```

#### UserCard.jsx
```
Props: 
  user: {
    id, name, status, distance, category, 
    image, description
  }
Purpose: Display single nearby user

Key Logic:
- Determines action button text based on user's status
- Calls initChat() and navigates to /chat on button click
- Uses color coding for status badges
```

#### Toast.jsx
```
Props:
  notification: {
    id, type, message, duration
  }
  onClose: fn
Purpose: Temporary notification display

Key Logic:
1. Auto-dismiss after duration (usually 3000ms)
2. type can be: 'success', 'error', 'info'
3. Different icon for each type
4. Smooth fade-in animation
```

Usage:
```javascript
// In App.jsx
{notifications.map(n => (
  <Toast 
    key={n.id} 
    notification={n} 
    onClose={() => handleRemoveToast(n.id)} 
  />
))}
```

---

## 📄 Pages Deep Dives

### Auth Page `src/pages/Auth.jsx`

**Flow:**
1. User fills form
2. Form validation on submit
3. Show errors if invalid
4. Call mockAuthService if valid
5. Wait for response
6. If success: setUser() and navigate('/dashboard')

**Form Validation:**
- Email: regex pattern check
- Password: min 6 chars
- Password match: compare fields
- All fields required

**Error Handling:**
- Display errors in red banner
- Clear error on input change
- Disabled submit during loading

**State:**
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phone: '',
  address: ''
});

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [isLogin, setIsLogin] = useState(true);
```

### Dashboard Page `src/pages/Dashboard.jsx`

**Before Mount:**
- Check if user is logged in
- If not: redirect to `/`

**On Mount:**
1. Load mock nearby users
2. Sort by distance
3. Display in grid

**Components Used:**
- StatusToggle
- LocationStatus
- UserCard (repeated in grid)

**Responsive Grid:**
```javascript
// Grid changes by screen size:
// Mobile: 1 column (grid-cols-1)
// Tablet: 2 columns (md:grid-cols-2)
// Desktop: 3 columns (lg:grid-cols-3)
```

### Chat Page `src/pages/Chat.jsx`

**Before Mount:**
- Check if currentChatId is set
- If not: redirect to '/dashboard'

**On Mount:**
1. Load chat messages from store
2. If none, load mock messages
3. Setup auto-scroll ref

**Features:**
- Message bubbles with different colors
- Blue (user), grey (other)
- Timestamps on each message
- Auto-scroll to bottom
- Simulated response after 1 second

**Auto-scroll Logic:**
```javascript
const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]); // Scroll when messages change

// In JSX, at the end of messages list:
<div ref={messagesEndRef} />
```

### Profile Page `src/pages/Profile.jsx`

**Features:**
1. Display mode: Shows user info
2. Edit mode: Form to update info
3. Stats section
4. About section

**Edit Logic:**
- Click "Edit" to enter edit mode
- Edit form appears
- "Save Changes" saves (console.log only, no actual update)
- "Cancel" exits without saving

**Status Display:**
- Shows current status with color
- Includes emoji indicator
- Background matches status color

---

## 🎨 Tailwind CSS Classes Used

### Layout Classes
```
max-w-6xl, max-w-4xl, max-w-md    → Max width containers
mx-auto, px-4, py-8               → Spacing
flex, grid, gap-*, justify-*, items-*  → Layout
```

### Color Classes
```
text-gray-900, text-gray-600      → Text colors
bg-white, bg-gray-50, bg-blue-600  → Background colors
border-gray-200                   → Border colors
```

### Component Classes
```
rounded-lg, rounded-xl             → Border radius
shadow-sm, shadow-md               → Shadows
hover:bg-gray-100                  → Hover effects
transition-colors                  → Smooth transitions
```

### Responsive Classes
```
md:grid-cols-2    → Changes at 768px
lg:grid-cols-3    → Changes at 1024px
sm:p-4             → Padding at 640px+
```

---

## 🔗 Data Flow Examples

### Example 1: User Logs In

```
Auth.jsx (form submit)
    ↓
validateForm() → Check all fields
    ↓
mockAuthService.login(email, password)
    ↓
setUser(response.user) → Store in Zustand
    ↓
navigate('/dashboard') → Router redirects
    ↓
Dashboard.jsx loads → Checks if user exists
    ↓
DisplayDashboard
```

### Example 2: Status Change

```
StatusToggle.jsx (button click)
    ↓
handleStatusChange(newStatus)
    ↓
setStatus(newStatus) → Update store
    ↓
addNotification({...}) → Create toast
    ↓
App.jsx watches notifications
    ↓
Toast component appears
    ↓
Auto-dismiss after 3 seconds
    ↓
removeNotification(id) → Remove from list
```

### Example 3: Send Chat Message

```
Chat.jsx (user types & clicks send)
    ↓
handleSendMessage(e)
    ↓
Create newMessage object
    ↓
addMessage(currentChatId, newMessage)
    ↓
Update store → setMessages updates
    ↓
Component re-renders
    ↓
Messages list updates
    ↓
Auto-scroll to bottom
    ↓
setTimeout (1 second)
    ↓
Simulate response from other user
    ↓
addMessage() again
    ↓
Auto-scroll again
```

---

## 🧪 Testing the App

### Test Scenario 1: Full Authentication Flow

1. Open http://localhost:5173
2. Fill signup form (all fields required)
3. See validation errors if invalid
4. Submit valid form
5. Check Redux store has user
6. Should be redirected to /dashboard

### Test Scenario 2: Status Toggle

1. Be on dashboard
2. Click "Need Help" button
3. See button highlighted in red
4. See toast notification
5. See status in navbar change
6. Click another button
7. Repeat

### Test Scenario 3: Location

1. Be on dashboard
2. See LocationStatus component
3. If browser asks for permission, click "Allow"
4. Should see latitude, longitude, accuracy
5. If blocked, see error message
6. Click "Retry" to request again

### Test Scenario 4: Chat

1. Click "Offer Help" on any user
2. Should navigate to /chat
3. See mock messages loaded
4. Type message and click send
5. Message appears on right (blue)
6. After 1 second, simulated response appears on left (grey)
7. Click back arrow to return to dashboard

### Test Scenario 5: Profile

1. Click profile icon in navbar
2. See all user information
3. Click "Edit"
4. Modify fields
5. Click "Save Changes" (logs to console)
6. Click "Edit" again → see data preserved
7. Click "Cancel" in edit mode - exits without changes

---

## 🚀 Production Build

### Build Command
```bash
npm run build
```

### Output
- Creates `/dist` folder
- Minified HTML, CSS, JS
- Optimized images
- Sourcemaps for debugging

### Deploy Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**GitHub Pages**
- Push to GitHub
- Enable GitHub Pages in settings
- Point to `/dist` folder

---

## 📦 Adding New Dependencies

```bash
npm install <package-name>
```

**Common packages to add later:**
- `axios` - Better HTTP client than fetch
- `socket.io-client` - Real-time communication
- `date-fns` - Date manipulation
- `react-hot-toast` - Better toast library
- `zod` or `yup` - Form validation library

---

## 🐛 Common Issues & Solutions

### Issue: Styles not showing
**Solution:** Make sure Tailwind CSS is properly configured
- Check `tailwind.config.js` has correct `content` paths
- Check `src/index.css` has @tailwind directives
- Restart dev server

### Issue: Store state not updating
**Solution:** Remember to use Zustand correctly
```javascript
// ❌ Wrong - modifying state directly
state.user.name = 'New name';

// ✅ Correct - using set function
set({ user: { ...state.user, name: 'New name' } });
```

### Issue: Infinite re-renders
**Solution:** Check useEffect dependencies
```javascript
// ❌ Wrong - no dependencies
useEffect(() => { setNearbyUsers(...); });

// ✅ Correct - proper dependencies
useEffect(() => { setNearbyUsers(...); }, [setNearbyUsers]);
```

### Issue: Geolocation not working
**Solution:** 
- Can only work on HTTPS (except localhost)
- Browser must have permission granted
- Check browser console for errors
- Allow location permission when prompted

---

## 📝 Code Style Guidelines

### File Naming
- Components: PascalCase (Auth.jsx, StatusToggle.jsx)
- Utils/Services: camelCase (mockData.js, useStore.js)
- Folders: kebab-case (components/, store/, services/)

### Component Structure
```javascript
// Imports
import { ... } from '...';
import { useStore } from '...';

// Component function
export default function ComponentName() {
  // Hooks
  const { state, setState } = useStore();
  const [local, setLocal] = useState(...);
  
  // Effects
  useEffect(() => { ... }, [...]);
  
  // Handlers
  const handleClick = () => { ... };
  
  // Render
  return (
    <div>
      ...
    </div>
  );
}
```

### Naming Conventions
- State variables: `camelCase` (user, status, isLoading)
- Event handlers: `handleActionName` (handleStatusChange, handleClick)
- Setter functions: `setStateName` (setUser, setStatus)
- Booleans: `isState` or `hasFeature` (isLoading, hasError)

---

## 📚 Useful Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Router v6](https://reactrouter.com)
- [Lucide React Icons](https://lucide.dev)

---

## 🎓 Learning Paths

### Beginner
1. Understand React hooks (useState, useEffect)
2. Learn Tailwind CSS basics
3. Explore Zustand store
4. Understand React Router navigation

### Intermediate
1. Component composition and reusability
2. State management patterns
3. Form handling and validation
4. Error handling

### Advanced
1. Performance optimization (memo, useMemo, useCallback)
2. Custom hooks
3. Backend integration patterns
4. Socket.IO for real-time features
5. Authentication/Authorization flows

---

## 💡 Pro Tips

1. **Use React DevTools Extension** - Debug components easily
2. **Check Network Tab** - Monitor API calls (when backend is added)
3. **Use Console Logs** - Add `console.log()` to debug state
4. **Test Mobile** - Use browser DevTools device mode
5. **Read Error Messages** - They're usually helpful!
6. **Check Store State** - Print `useStore.getState()` in console
7. **Use Tailwind Docs** - CSS is now class-based, not custom CSS

---

## 🔄 Workflow Tips

### Development Workflow
1. Make a small change
2. Test in browser immediately
3. Check console for errors
4. Visual inspection
5. Move to next feature

### Feature Addition Workflow
1. Create new component/page file
2. Add to routing if page
3. Import and use
4. Style with Tailwind
5. Connect to store if needed
6. Test thoroughly

### Bug Fixing Workflow
1. Reproduce the bug
2. Find the exact point of failure
3. Check browser console
4. Add console.logs
5. Check store state
6. Fix the root cause
7. Test the fix
8. Look for similar bugs elsewhere

---

**You now have a complete understanding of the HelpHive codebase!** 🚀

Happy coding! 🐝
