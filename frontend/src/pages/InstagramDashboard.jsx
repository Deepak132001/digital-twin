// src/pages/InstagramDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart2, Users, Image, TrendingUp } from 'lucide-react';
import instagramService from '../services/instagramService';
import ConnectInstagram from '../components/instagram/ConnectInstagram';

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
      const insightsData = await instagramService.getInsights();
      setData(insightsData.data);
    } catch (error) {
      setError('Failed to fetch Instagram data');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.instagram?.connected) {
    return <ConnectInstagram />;
  }

  const statsCards = [
    {
      title: 'Followers',
      value: data?.followers || 0,
      change: '+5.2%',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Posts',
      value: data?.posts || 0,
      change: '+2.1%',
      icon: Image,
      color: 'text-green-500'
    },
    {
      title: 'Engagement Rate',
      value: `${data?.engagementRate || 0}%`,
      change: '+3.1%',
      icon: BarChart2,
      color: 'text-purple-500'
    },
    {
      title: 'Profile Visits',
      value: data?.profileVisits || 0,
      change: '+8.3%',
      icon: TrendingUp,
      color: 'text-pink-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instagram Insights</h1>
        <button
          onClick={fetchInstagramData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">{card.change}</span>
              <span className="text-sm text-gray-500"> vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon: AI Features */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">AI Features Coming Soon!</h3>
        <p>Get AI-powered content suggestions, optimal posting times, and hashtag recommendations.</p>
      </div>
    </div>
  );
};

export default InstagramDashboard;