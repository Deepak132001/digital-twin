// src/components/dashboard/InstagramConnect.jsx
import { Instagram } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const InstagramConnect = () => {
  const { user } = useAuth();

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/instagram/auth-url', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      window.location.href = data.data.authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <Instagram className="w-16 h-16 mx-auto mb-4 text-pink-500" />
        <h2 className="text-2xl font-bold mb-4">Connect Instagram Account</h2>
        <p className="text-gray-600 mb-6">
          Connect your Instagram account to start analyzing your performance and get personalized recommendations.
        </p>
        <button
          onClick={handleConnect}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Connect Instagram
        </button>
      </div>
    </div>
  );
};

export default InstagramConnect;