// src/components/instagram/InstagramInsights.jsx
import { useState, useEffect } from 'react';
import { Users, BarChart2, Clock, Hash } from 'lucide-react';
import instagramService from '../../services/instagramService';

const InstagramInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const data = await instagramService.getMediaInsights();
      setInsights(data.data);
    } catch (error) {
      setError('Failed to load Instagram insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Instagram Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Followers</span>
          </div>
          <p className="text-2xl font-bold">{insights?.followers?.count || 0}</p>
          <span className="text-sm text-green-600">
            +{insights?.followers?.growth || 0}% this week
          </span>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Engagement Rate</span>
          </div>
          <p className="text-2xl font-bold">{insights?.engagement?.rate || 0}%</p>
          <span className="text-sm text-green-600">
            +{insights?.engagement?.growth || 0}% vs last week
          </span>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Best Time to Post</span>
          </div>
          <p className="text-2xl font-bold">{insights?.bestTime || 'N/A'}</p>
          <span className="text-sm text-gray-600">Based on follower activity</span>
        </div>

        <div className="p-4 bg-pink-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-5 h-5 text-pink-500" />
            <span className="text-sm text-gray-600">Top Hashtag</span>
          </div>
          <p className="text-2xl font-bold">{insights?.topHashtag || 'N/A'}</p>
          <span className="text-sm text-gray-600">Most engaging hashtag</span>
        </div>
      </div>
    </div>
  );
};

export default InstagramInsights;