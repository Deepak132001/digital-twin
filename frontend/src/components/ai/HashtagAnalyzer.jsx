// src/components/ai/HashtagAnalyzer.jsx
import { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import aiService from '../../services/aiService';

const HashtagAnalyzer = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const analyzeHashtags = async () => {
    if (!query.trim()) {
      setError('Please enter a topic or hashtags to analyze');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await aiService.suggestHashtags(query);
      
      console.log('API Response:', response); // Debug log

      // Make sure we have arrays for both types of hashtags
      setResults({
        popularHashtags: Array.isArray(response.data.hashtags) ? response.data.hashtags : [],
        nicheHashtags: Array.isArray(response.data.nicheHashtags) ? response.data.nicheHashtags : []
      });
    } catch (error) {
      console.error('Hashtag analysis error:', error);
      setError('Failed to analyze hashtags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Hashtag Analyzer</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter topic or existing hashtags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., fitness, travel, food..."
            />
            <button
              onClick={analyzeHashtags}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Popular Hashtags */}
            {results.popularHashtags && results.popularHashtags.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium">Popular Hashtags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.popularHashtags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Niche Hashtags */}
            {results.nicheHashtags && results.nicheHashtags.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium">Niche Hashtags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.nicheHashtags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!results && !loading && !error && (
          <div className="text-center py-12 text-gray-500">
            Enter a topic or hashtags to get suggestions
          </div>
        )}
      </div>
    </div>
  );
};

export default HashtagAnalyzer;