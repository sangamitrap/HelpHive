import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import HelpRequestForm from './HelpRequestForm';

export default function UserCard({ user }) {
  const navigate = useNavigate();
  const { user: currentUser, status: userStatus } = useStore();
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleAction = () => {
    if (!currentUser) return;

    // If user needs help, send a help request
    if (user.status === 'need-help') {
      setShowRequestForm(true);
    } else {
      // If user is helping, request help from them
      setShowRequestForm(true);
    }
  };

  const handleFormClose = () => {
    setShowRequestForm(false);
  };

  const getStatusBadgeColor = () => {
    return user.status === 'need-help'
      ? 'bg-red-100 text-red-700'
      : 'bg-green-100 text-green-700';
  };

  const getStatusDot = () => {
    return user.status === 'need-help' ? '🔴' : '🟢';
  };

  const getActionText = () => {
    return user.status === 'need-help' ? 'Offer to Help' : 'Ask for Help';
  };

  // Don't show self-interaction
  if (currentUser && user.id === currentUser.id) {
    return null;
  }

  return (
    <>
      <div className="card p-5 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{user.image}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.category}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}>
            {getStatusDot()} {user.status === 'need-help' ? 'Needs Help' : 'Can Help'}
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">{user.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          {user.distance} km away
        </div>

        <button
          onClick={handleAction}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {getActionText()}
        </button>
      </div>

      {showRequestForm && (
        <HelpRequestForm
          targetUser={user}
          onClose={handleFormClose}
        />
      )}
    </>
  );
}
