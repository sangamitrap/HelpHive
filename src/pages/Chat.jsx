import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Send, ArrowLeft } from 'lucide-react';
import { mockChatMessages } from '../services/mockData';

export default function Chat() {
  const navigate = useNavigate();
  const { user, currentChatId, chats, addMessage } = useStore();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  // Redirect if no active chat
  useEffect(() => {
    if (!currentChatId || !currentChat) {
      navigate('/dashboard');
      return;
    }

    // Initialize with mock messages
    if (currentChat.messages.length === 0) {
      setMessages(mockChatMessages);
    } else {
      setMessages(currentChat.messages);
    }
  }, [currentChatId, currentChat, navigate]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    addMessage(currentChatId, newMessage);
    setMessageText('');

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: '👍 Got it! Let me check and get back to you.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
      addMessage(currentChatId, responseMessage);
    }, 1000);
  };

  if (!user || !currentChat) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900">{currentChat.userName}</h1>
            <p className="text-xs text-gray-600">
              {currentChat.userStatus === 'helping' ? '🟢 Available to help' : '🔴 Needs help'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-600'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 input-field"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
