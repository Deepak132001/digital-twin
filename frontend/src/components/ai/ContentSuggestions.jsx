// src/components/ai/ContentSuggestions.jsx
import { useState } from 'react';
import { Lightbulb, Hash, MessageCircle, Sparkles } from 'lucide-react';
import aiService from '../../services/aiService';

const ContentSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');

  const generateSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await aiService.generateContentIdeas('general', 'general audience');
      console.log('AI Response:', response); // Debug log
      
      // Parse the response data properly
      setSuggestions({
        ideas: response.data.ideas || [],
        captions: [],  // Initialize empty arrays for other properties
        hashtags: []
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setError('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">AI Content Suggestions</h3>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Ideas'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {suggestions && (
        <div className="space-y-6">
          {/* Content Ideas */}
          {suggestions.ideas && suggestions.ideas.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium">Post Ideas</h4>
              </div>
              <ul className="space-y-2">
                {suggestions.ideas.map((idea, index) => (
                  <li key={index} className="text-gray-700">{idea}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Caption Suggestions */}
          {suggestions.captions && suggestions.captions.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Caption Templates</h4>
              </div>
              <div className="space-y-3">
                {suggestions.captions.map((caption, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-blue-100">
                    {caption}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hashtag Suggestions */}
          {suggestions.hashtags && suggestions.hashtags.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">Recommended Hashtags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.hashtags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white text-green-700 rounded-full text-sm border border-green-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!suggestions && !loading && (
        <div className="text-center py-12 text-gray-500">
          Click "Generate Ideas" to get AI-powered content suggestions
        </div>
      )}
    </div>
  );
};

export default ContentSuggestions;