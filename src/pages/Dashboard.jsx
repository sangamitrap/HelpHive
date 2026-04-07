import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import StatusToggle from '../components/StatusToggle';
import LocationStatus from '../components/LocationStatus';
import UserCard from '../components/UserCard';
import { mockNearbyUsers } from '../services/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, nearbyUsers, setNearbyUsers } = useStore();
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Load nearby users on mount
  useEffect(() => {
    setNearbyUsers(mockNearbyUsers);
  }, [setNearbyUsers]);

  // Filter and sort users by distance
  useEffect(() => {
    const sorted = [...nearbyUsers].sort((a, b) => a.distance - b.distance);
    setFilteredUsers(sorted);
  }, [nearbyUsers]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Find help or offer your skills to nearby community members
          </p>
        </div>

        {/* Status and Location section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusToggle />
          <LocationStatus />
        </div>

        {/* Nearby Users section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Nearby Community Members
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredUsers.length} members
            </span>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((userCard) => (
                <UserCard key={userCard.id} user={userCard} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-600 font-medium">No users nearby yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Try again later or change your location settings
              </p>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-semibold text-gray-900">Build Community</h3>
            <p className="text-sm text-gray-600 mt-1">Help neighbors you've never met</p>
          </div>

          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold text-gray-900">Local First</h3>
            <p className="text-sm text-gray-600 mt-1">Find help within your neighborhood</p>
          </div>

          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold text-gray-900">Easy Connection</h3>
            <p className="text-sm text-gray-600 mt-1">Chat and coordinate directly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
