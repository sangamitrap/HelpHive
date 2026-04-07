import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, status, setStatus, setUser } = useStore();

  const handleLogout = () => {
    setUser(null);
    setStatus('off');
    navigate('/');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'need-help':
        return 'bg-red-100 text-red-700';
      case 'helping':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'need-help':
        return 'Need Help';
      case 'helping':
        return 'Helping';
      default:
        return 'Offline';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="text-2xl">🐝</div>
          <h1 className="text-xl font-bold text-gray-900">HelpHive</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </div>

              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-700">{user.fullName}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
