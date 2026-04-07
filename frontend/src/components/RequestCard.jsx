import { Check, X, MessageSquare, Clock, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function RequestCard({ request, type }) {
  const navigate = useNavigate();
  const { updateRequest, addNotification } = useStore();

  const handleAccept = () => {
    updateRequest(request.id, { status: 'accepted' });

    addNotification({
      id: Date.now(),
      type: 'success',
      message: `You accepted ${request.requesterName}'s help request!`,
      duration: 3000,
    });
  };

  const handleReject = () => {
    updateRequest(request.id, { status: 'rejected' });

    addNotification({
      id: Date.now(),
      type: 'info',
      message: `You declined ${request.requesterName}'s help request`,
      duration: 3000,
    });
  };

  const handleChat = () => {
    // Navigate to chat - chat should be created after request accepted
    navigate('/chat');
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  const getUrgencyColor = () => {
    switch (request.urgency) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyIcon = () => {
    switch (request.urgency) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = () => {
    const categories = {
      general: 'General Help',
      technical: 'Technical Support',
      household: 'Household Tasks',
      transportation: 'Transportation',
      shopping: 'Shopping/Errands',
      medical: 'Medical Assistance',
      other: 'Other'
    };
    return categories[request.category] || 'General Help';
  };

  return (
    <div className="card p-4 border-l-4" style={{
      borderLeftColor: type === 'received' ? '#ef4444' : '#22c55e'
    }}>
      {/* Header with name and status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{type === 'received' ? '📥' : '📤'}</span>
            <h4 className="font-bold text-lg text-gray-900">
              {type === 'received' ? request.requesterName : request.helperName}
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            {type === 'received' 
              ? 'Asking you for help'
              : 'You offered to help'
            }
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Help Requirements */}
      <div className="mb-3 bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-700 font-medium mb-1">What they need:</p>
        <p className="text-sm text-gray-600">
          {request.helpRequirements || 'No specific requirements provided'}
        </p>
      </div>

      {/* Category and Urgency - Horizontal layout */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-xs text-blue-600 font-semibold">{getCategoryLabel()}</p>
        </div>
        <div className={`p-2 rounded flex items-center gap-1`} style={{backgroundColor: `${getUrgencyColor().split(' ')[0] === 'text-red-600' ? '#fee2e2' : 'text-yellow-600' ? '#fef3c7' : '#dcfce7'}`}}>
          <span className="text-xs">{getUrgencyIcon()}</span>
          <p className="text-xs font-semibold">{request.urgency ? request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1) : 'Medium'}</p>
        </div>
      </div>

      {/* Time info */}
      <p className="text-xs text-gray-400 mb-3">
        {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>

      <div className="flex gap-2">
        {request.status === 'pending' && type === 'received' && (
          <>
            <button
              onClick={handleAccept}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              Decline
            </button>
          </>
        )}

        {request.status === 'accepted' && (
          <button
            onClick={handleChat}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Start Chat
          </button>
        )}

        {request.status === 'pending' && type === 'sent' && (
          <div className="w-full text-center py-2 text-sm text-gray-600">
            Waiting for response...
          </div>
        )}
      </div>
    </div>
  );
}