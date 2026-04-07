import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function HelpRequestForm({ targetUser, onClose }) {
  const { user: currentUser, addRequest, addNotification } = useStore();
  const [helpRequirements, setHelpRequirements] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [category, setCategory] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!helpRequirements.trim()) {
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Please describe what help you need',
        duration: 3000,
      });
      return;
    }

    const requestData = {
      helperId: targetUser.id,
      helpRequirements: helpRequirements.trim(),
      urgency,
      category,
      // Add location if available
      longitude: currentUser.longitude,
      latitude: currentUser.latitude,
    };

    try {
      await addRequest(requestData);

      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Help request sent to ${targetUser.name}!`,
        duration: 3000,
      });

      onClose();
    } catch (error) {
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Failed to send help request. Please try again.',
        duration: 3000,
      });
    }
  };

  const categories = [
    { value: 'general', label: 'General Help' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'household', label: 'Household Tasks' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping/Errands' },
    { value: 'medical', label: 'Medical Assistance' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Request Help from {targetUser.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What help do you need?
              </label>
              <textarea
                value={helpRequirements}
                onChange={(e) => setHelpRequirements(e.target.value)}
                placeholder="Describe what you need help with in detail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value="low"
                    checked={urgency === 'low'}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Low - Can wait a few days</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value="medium"
                    checked={urgency === 'medium'}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Medium - Need help within 24 hours</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value="high"
                    checked={urgency === 'high'}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">High - Need help immediately</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}