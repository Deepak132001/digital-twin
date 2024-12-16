// src/components/instagram/InstagramConnect.jsx
import { useState } from 'react';
import { Instagram, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import instagramService from '../../services/instagramService';

const InstagramConnect = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectInstagram = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await instagramService.getAuthUrl();
      window.location.href = response.data.authUrl;
    } catch (error) {
      setError('Failed to connect to Instagram. Please try again.');
      console.error('Instagram connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Instagram className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold mb-4">Connect Instagram Account</h2>
        <p className="text-gray-600 mb-8">
          Connect your Instagram account to get AI-powered insights and content suggestions.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleConnectInstagram}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Connecting...</span>
          ) : (
            <>
              Connect Instagram
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          We'll analyze your Instagram data to provide personalized recommendations
        </p>
      </div>
    </div>
  );
};

export default InstagramConnect;