// backend/src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instagramPostId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'carousel'],
    required: true
  },
  caption: String,
  hashtags: [String],
  mediaUrl: String,
  engagement: {
    likes: Number,
    comments: Number,
    shares: Number,
    saves: Number
  },
  insights: {
    reach: Number,
    impressions: Number,
    engagementRate: Number
  },
  postedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);