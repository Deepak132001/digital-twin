// src/components/dashboard/AnalyticsSummary.jsx
import { Users, Image, TrendingUp } from 'lucide-react';

const AnalyticsSummary = ({ stats, loading }) => {
  const summaryCards = [
    {
      title: 'Followers',
      value: stats?.followers || 0,
      icon: Users,
      change: '+5.2%'
    },
    {
      title: 'Posts',
      value: stats?.posts || 0,
      icon: Image,
      change: '+2.1%'
    },
    {
      title: 'Engagement Rate',
      value: `${stats?.engagementRate || 0}%`,
      icon: TrendingUp,
      change: '+3.1%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <card.icon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">{card.change}</span>
            <span className="text-sm text-gray-500"> vs last week</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSummary;