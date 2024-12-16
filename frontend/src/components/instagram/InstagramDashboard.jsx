// src/components/instagram/InstagramDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Refresh, Instagram, BarChart2, Users } from 'lucide-react';
import instagramService from '../../services/instagramService';
import InstagramConnect from './InstagramConnect';

const InstagramDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.instagram?.connected) {
      fetchInstagramData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchInstagramData = async () => {
    try {
      setLoading(true);
      const response = await instagramService.syncData();
      setData(response.data);
    } catch (error) {
      setError('Failed to fetch Instagram data');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.instagram?.connected) {
    return <InstagramConnect />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instagram Overview</h1>
        <button
          onClick={fetchInstagramData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
        >
          <Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sync Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        {data && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Users className="w-5 h-5" />
                <h3 className="font-medium">Followers</h3>
              </div>
              <p className="text-2xl font-bold">{data.followers}</p>
              <p className="text-sm text-gray-500 mt-1">Total followers</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <Instagram className="w-5 h-5" />
                <h3 className="font-medium">Posts</h3>
              </div>
              <p className="text-2xl font-bold">{data.posts}</p>
              <p className="text-sm text-gray-500 mt-1">Total posts</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <BarChart2 className="w-5 h-5" />
                <h3 className="font-medium">Engagement</h3>
              </div>
              <p className="text-2xl font-bold">{data.engagement}%</p>
              <p className="text-sm text-gray-500 mt-1">Average engagement rate</p>
            </div>
          </>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default InstagramDashboard;