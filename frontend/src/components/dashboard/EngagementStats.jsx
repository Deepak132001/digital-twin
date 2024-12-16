// src/components/dashboard/EngagementStats.jsx
import { TrendingUp, Clock, Image, MessageCircle } from 'lucide-react';

const EngagementStats = ({ stats, loading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
      
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Best Time to Post</p>
              <p className="text-lg font-medium">8:00 PM - 10:00 PM</p>
              <p className="text-xs text-gray-500 mt-1">Based on follower activity</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Image className="w-5 h-5 text-green-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Top Performing Content</p>
              <p className="text-lg font-medium">Image Posts</p>
              <p className="text-xs text-gray-500 mt-1">Higher engagement rate</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <MessageCircle className="w-5 h-5 text-purple-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Average Comments</p>
              <p className="text-lg font-medium">24 per post</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-rose-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-lg font-medium">+5.2%</p>
              <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementStats;