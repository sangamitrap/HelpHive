import { useStore } from '../store/useStore';

export default function StatusToggle() {
  const { status, setStatus, addNotification } = useStore();

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    
    if (newStatus === 'need-help') {
      addNotification({
        id: Date.now(),
        type: 'info',
        message: '🔍 Notifying nearby users...',
        duration: 3000,
      });
    } else if (newStatus === 'helping') {
      addNotification({
        id: Date.now(),
        type: 'success',
        message: '✅ You are now available to help!',
        duration: 3000,
      });
    }
  };

  const getButtonColor = (buttonStatus) => {
    if (status === buttonStatus) {
      if (buttonStatus === 'need-help') {
        return 'bg-red-500 text-white';
      } else if (buttonStatus === 'helping') {
        return 'bg-green-500 text-white';
      } else {
        return 'bg-gray-500 text-white';
      }
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Your Status</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleStatusChange('off')}
          className={`py-3 px-4 rounded-lg font-medium transition-all ${getButtonColor('off')}`}
        >
          <div className="text-2xl mb-1">⊘</div>
          <div className="text-xs">Offline</div>
        </button>

        <button
          onClick={() => handleStatusChange('need-help')}
          className={`py-3 px-4 rounded-lg font-medium transition-all ${getButtonColor('need-help')}`}
        >
          <div className="text-2xl mb-1">🆘</div>
          <div className="text-xs">Need Help</div>
        </button>

        <button
          onClick={() => handleStatusChange('helping')}
          className={`py-3 px-4 rounded-lg font-medium transition-all ${getButtonColor('helping')}`}
        >
          <div className="text-2xl mb-1">🤝</div>
          <div className="text-xs">Helping</div>
        </button>
      </div>

      {status === 'off' && (
        <p className="text-sm text-gray-500 mt-4">You are currently offline</p>
      )}
      {status === 'need-help' && (
        <p className="text-sm text-red-600 mt-4">🔴 You are looking for help</p>
      )}
      {status === 'helping' && (
        <p className="text-sm text-green-600 mt-4">🟢 You are available to help</p>
      )}
    </div>
  );
}
