// src/components/instagram/RecentPosts.jsx
import { useState, useEffect } from 'react';
import { Calendar, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import instagramService from '../../services/instagramService';

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await instagramService.getMediaInsights();
      setPosts(response.data.posts || []);
    } catch (error) {
      setError('Failed to load recent posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden">
            <img 
              src={post.mediaUrl} 
              alt="Post" 
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.timestamp).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {post.engagementRate}%
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                {post.caption}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-rose-500">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  
                  <div className="flex items-center text-blue-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;