// src/components/ai/CaptionGenerator.jsx
import { useState } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';
import aiService from '../../services/aiService';

const CaptionGenerator = () => {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateCaption = async () => {
    if (!context.trim()) {
      setError('Please describe your content first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await aiService.generateCaption(context);
      setCaption(response.data.caption);
    } catch (error) {
      setError('Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">AI Caption Generator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe your content
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe what your post is about..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={generateCaption}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <MessageSquare className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Caption'}
        </button>

        {caption && (
          <div className="relative mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{caption}</p>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionGenerator;