// src/pages/AIDashboard.jsx
import { useState } from 'react';
import ContentSuggestions from '../components/ai/ContentSuggestions';
import CaptionGenerator from '../components/ai/CaptionGenerator';
import HashtagAnalyzer from '../components/ai/HashtagAnalyzer';
import ContentAnalyzer from '../components/ai/ContentAnalyzer';

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState('suggestions');

  const tabs = [
    { id: 'suggestions', label: 'Content Ideas' },
    { id: 'captions', label: 'Caption Generator' },
    { id: 'hashtags', label: 'Hashtag Analysis' },
    { id: 'analyzer', label: 'Content Analyzer' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'suggestions':
        return <ContentSuggestions />;
      case 'captions':
        return <CaptionGenerator />;
      case 'hashtags':
        return <HashtagAnalyzer />;
      case 'analyzer':
        return <ContentAnalyzer />;
      default:
        return <ContentSuggestions />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AIDashboard;