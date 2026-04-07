import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import StatusToggle from '../components/StatusToggle';
import LocationStatus from '../components/LocationStatus';
import UserCard from '../components/UserCard';
import RequestCard from '../components/RequestCard';
import { mockNearbyUsers } from '../services/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    nearbyUsers,
    setNearbyUsers,
    getReceivedRequests,
    getSentRequests,
    status,
    loadRequests,
    initializeUser,
    chats,
    loadChats,
    setCurrentChatId
  } = useStore();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Initialize user and load data on mount
  useEffect(() => {
    if (!user) {
      initializeUser();
    } else {
      // Load requests, chats, and nearby users
      loadRequests();
      loadChats();
      // Load nearby users if location is available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setNearbyUsers(longitude, latitude);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Fallback to mock data
            setNearbyUsers([]);
          }
        );
      }
    }
  }, [user, initializeUser, loadRequests, loadChats, setNearbyUsers]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Filter and sort users by distance, exclude self
  useEffect(() => {
    if (user) {
      const filtered = nearbyUsers
        .filter(u => u.id !== user.id)
        .sort((a, b) => a.distance - b.distance);
      setFilteredUsers(filtered);
    }
  }, [nearbyUsers, user]);

  // Load requests from store
  useEffect(() => {
    if (user) {
      setReceivedRequests(getReceivedRequests());
      setSentRequests(getSentRequests());
    }
  }, [user, getReceivedRequests, getSentRequests]);

  if (!user) {
    return null;
  }

  const handleChatClick = (chatId) => {
    setCurrentChatId(chatId);
    navigate('/chat');
  };

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

        {/* My Help Request section - only show if user needs help */}
        {status === 'need-help' && (
          <div className="card p-6 mb-8 bg-red-50 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🆘</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">You're Looking for Help</h2>
                <p className="text-sm text-gray-600">Nearby community members can see your request</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">Your Status</h3>
              <p className="text-sm text-gray-700">
                🔴 You are currently looking for help from your neighbors. People in your area will see your request and can offer assistance.
              </p>
            </div>
          </div>
        )}

        {/* Requests section - Reorganized */}
        {(receivedRequests.length > 0 || sentRequests.length > 0) && (
          <div className="mb-8">
            {/* Incoming Requests Section */}
            {receivedRequests.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">🤝</div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    People Asking You for Help ({receivedRequests.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {receivedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} type="received" />
                  ))}
                </div>
              </div>
            )}

            {/* Outgoing Requests Section */}
            {sentRequests.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">✋</div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    People You're Helping ({sentRequests.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {sentRequests.map((request) => (
                    <RequestCard key={request.id} request={request} type="sent" />
                  ))}
                </div>
              </div>
            )}

            {receivedRequests.length === 0 && sentRequests.length === 0 && (
              <div className="card p-8 text-center bg-blue-50 border border-blue-200">
                <p className="text-gray-600 text-lg">No active help requests yet</p>
                <p className="text-sm text-gray-500 mt-1">Explore nearby members to start helping or request help</p>
              </div>
            )}
          </div>
        )}

        {/* Active Chats section */}
        {chats.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Active Conversations ({chats.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Continue your help conversations
            </p>
            <div className="space-y-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {chat.otherUser?.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {chat.otherUser?.fullName || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleDateString() : ''}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
