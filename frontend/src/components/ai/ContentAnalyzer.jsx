// src/components/ai/ContentAnalyzer.jsx
import { useState } from 'react';
import { BarChart2, Target, Users, Clock } from 'lucide-react';
import aiService from '../../services/aiService';

const ContentAnalyzer = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Sending content for analysis:', content); // Debug log
      
      const response = await aiService.analyzeContent(content);
      console.log('Analysis response:', response); // Debug log

      setAnalysis(response.data);
    } catch (error) {
      console.error('Content analysis error:', error);
      setError('Failed to analyze content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Content Analyzer</h3>

      <div className="space-y-6">
        {/* Input Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Paste your caption or content here..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={analyzeContent}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <BarChart2 className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Analyze Content'}
        </button>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Engagement Score */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">Engagement Potential</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium">{analysis.engagementScore}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(analysis.engagementScore/10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Audience Insights */}
            {analysis.audienceInsights && analysis.audienceInsights.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium">Audience Insights</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.audienceInsights.map((insight, index) => (
                    <li key={index} className="text-gray-700">{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Best Posting Time */}
            {analysis.bestTime && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium">Best Posting Time</h4>
                </div>
                <p className="text-gray-700">{analysis.bestTime}</p>
              </div>
            )}

            {/* Improvement Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Suggestions for Improvement</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAnalyzer;