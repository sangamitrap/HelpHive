import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

function App() {
  const { user, notifications, removeNotification } = useStore();
  const [toasts, setToasts] = useState([]);

  // Sync notifications to toasts
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setToasts((prev) => [...prev, latestNotification]);
    }
  }, [notifications]);

  const handleRemoveToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    removeNotification(id);
  };

  return (
    <Router>
      {user && <Navbar />}

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 space-y-2 z-50 max-w-md">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              notification={toast}
              onClose={() => handleRemoveToast(toast.id)}
            />
          ))}
        </div>
      )}

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;
