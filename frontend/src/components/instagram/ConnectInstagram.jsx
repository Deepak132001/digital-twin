// src/components/instagram/ConnectInstagram.jsx
import { useState } from 'react';
import { Instagram, ArrowRight } from 'lucide-react';
import axios from 'axios';

const ConnectInstagram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/instagram/auth-url`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Redirect to Instagram authorization
      window.location.href = response.data.data.authUrl;
    } catch (error) {
      setError('Failed to connect to Instagram. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="bg-pink-50 rounded-full p-4 w-16 h-16 mx-auto mb-6">
          <Instagram className="w-8 h-8 text-pink-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Connect Instagram Account</h2>
        <p className="text-gray-600 mb-8">
          Connect your Instagram business account to get insights, analytics, and AI-powered suggestions.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            'Connecting...'
          ) : (
            <>
              Connect Instagram
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          You'll be redirected to Instagram to authorize access
        </p>
      </div>
    </div>
  );
};

export default ConnectInstagram;