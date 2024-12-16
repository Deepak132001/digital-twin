// backend/src/models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instagram: {
        followers: [{
            count: Number,
            date: Date
        }],
        engagement: [{
            rate: Number,
            date: Date
        }],
        posts: [{
            postId: String,
            likes: Number,
            comments: Number,
            engagement: Number,
            date: Date
        }],
        bestTimes: [{
            day: Number,
            hour: Number,
            engagement: Number
        }],
        topHashtags: [{
            tag: String,
            engagement: Number,
            uses: Number
        }]
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);