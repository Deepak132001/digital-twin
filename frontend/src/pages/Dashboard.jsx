// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InstagramConnect from '../components/dashboard/InstagramConnect';
import AnalyticsSummary from '../components/dashboard/AnalyticsSummary';
import RecentPosts from '../components/dashboard/RecentPosts';
import EngagementStats from '../components/dashboard/EngagementStats';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Add null check for user and user.instagram
  if (user && !user.instagram?.connected) {
    return <InstagramConnect />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <AnalyticsSummary stats={stats} loading={loading} />
        </div>
        <div>
          <EngagementStats stats={stats} loading={loading} />
        </div>
      </div>

      <div className="mt-8">
        <RecentPosts />
      </div>
    </div>
  );
};

export default Dashboard;