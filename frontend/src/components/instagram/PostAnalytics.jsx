// src/components/instagram/PostAnalytics.jsx
import { useState, useEffect } from 'react';
import { BarChart2, Clock, Hash, Target } from 'lucide-react';
import instagramService from '../../services/instagramService';

const PostAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await instagramService.getMediaInsights();
      setAnalytics(response.data.analytics);
    } catch (error) {
      setError('Failed to load post analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
      <h3 className="text-lg font-semibold mb-4">Post Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Best Performing Post Type</span>
            </div>
            <p className="text-gray-600">
              {analytics?.bestType || 'No data available'}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="font-medium">Optimal Posting Time</span>
            </div>
            <p className="text-gray-600">
              {analytics?.optimalTime || 'No data available'}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Top Performing Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analytics?.topHashtags?.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Engagement Breakdown</span>
          </div>
          
          {analytics?.engagement?.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{item.type}</span>
                <span className="text-sm font-medium">{item.rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${item.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostAnalytics;