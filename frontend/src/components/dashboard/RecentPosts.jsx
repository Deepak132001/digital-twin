// src/components/dashboard/RecentPosts.jsx
import { Calendar, Heart, MessageCircle, Share2 } from 'lucide-react';

const RecentPosts = () => {
  // Dummy data for demonstration
  const posts = [
    {
      id: 1,
      imageUrl: '/api/placeholder/400/400',
      likes: 120,
      comments: 14,
      shares: 5,
      date: '2 hours ago',
      type: 'image'
    },
    {
      id: 2,
      imageUrl: '/api/placeholder/400/400',
      likes: 89,
      comments: 8,
      shares: 3,
      date: '5 hours ago',
      type: 'image'
    },
    {
      id: 3,
      imageUrl: '/api/placeholder/400/400',
      likes: 234,
      comments: 23,
      shares: 12,
      date: '1 day ago',
      type: 'image'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Post" 
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-rose-500">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  
                  <div className="flex items-center text-blue-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.comments}</span>
                  </div>
                  
                  <div className="flex items-center text-green-500">
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.shares}</span>
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