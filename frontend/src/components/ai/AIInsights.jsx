// src/components/ai/AIInsights.jsx
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, Target, Lightbulb } from 'lucide-react';
import aiService from '../../services/aiService';

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await aiService.getProfileAnalysis();
      setInsights(response.data);
    } catch (error) {
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performance Times */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium">Optimal Posting Times</h3>
          </div>
          <div className="space-y-2">
            {insights?.patterns?.bestTimes?.map((time, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{time.day}</span>
                <span className="font-medium">{time.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-medium">Engagement Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Engagement Rate</span>
              <span className="font-medium">{insights?.metrics?.engagementRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Best Performing Content</span>
              <span className="font-medium">{insights?.metrics?.bestContent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium">AI Recommendations</h3>
        </div>
        <div className="space-y-4">
          {insights?.insights?.recommendations?.map((rec, index) => (
            <div key={index} className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-rose-600" />
          <h3 className="font-medium">Growth Opportunities</h3>
        </div>
        <div className="space-y-3">
          {insights?.insights?.growthOpportunities?.map((opportunity, index) => (
            <div key={index} className="p-3 bg-rose-50 rounded-lg">
              <p className="text-gray-700">{opportunity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;