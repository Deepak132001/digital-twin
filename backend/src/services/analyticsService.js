// backend/src/services/analyticsService.js
const Analytics = require('../models/Analytics');
const User = require('../models/User');

class AnalyticsService {
    async calculateEngagementRate(likes, comments, followers) {
        if (!followers) return 0;
        return ((likes + comments) / followers) * 100;
    }

    async processPostAnalytics(posts, followers) {
        return posts.map(post => {
            const engagement = this.calculateEngagementRate(
                post.like_count || 0,
                post.comments_count || 0,
                followers
            );

            return {
                postId: post.id,
                likes: post.like_count || 0,
                comments: post.comments_count || 0,
                engagement,
                date: new Date(post.timestamp)
            };
        });
    }

    async findBestPostingTimes(posts) {
        const timeStats = {};

        posts.forEach(post => {
            const date = new Date(post.timestamp);
            const day = date.getDay();
            const hour = date.getHours();
            const key = `${day}-${hour}`;

            if (!timeStats[key]) {
                timeStats[key] = {
                    day,
                    hour,
                    totalEngagement: 0,
                    count: 0
                };
            }

            timeStats[key].totalEngagement += post.engagement;
            timeStats[key].count++;
        });

        return Object.values(timeStats)
            .map(stat => ({
                day: stat.day,
                hour: stat.hour,
                engagement: stat.totalEngagement / stat.count
            }))
            .sort((a, b) => b.engagement - a.engagement)
            .slice(0, 5);
    }

    async analyzeHashtags(posts) {
        const hashtagStats = {};

        posts.forEach(post => {
            const hashtags = (post.caption || '').match(/#[\w]+/g) || [];
            
            hashtags.forEach(tag => {
                if (!hashtagStats[tag]) {
                    hashtagStats[tag] = {
                        tag,
                        engagement: 0,
                        uses: 0
                    };
                }

                hashtagStats[tag].engagement += post.engagement;
                hashtagStats[tag].uses++;
            });
        });

        return Object.values(hashtagStats)
            .sort((a, b) => b.engagement - a.engagement)
            .slice(0, 10);
    }

    async updateAnalytics(userId, instagramData) {
        try {
            const { profile, posts } = instagramData;
            
            const processedPosts = await this.processPostAnalytics(
                posts,
                profile.followers_count
            );

            const bestTimes = await this.findBestPostingTimes(processedPosts);
            const topHashtags = await this.analyzeHashtags(processedPosts);

            const analytics = await Analytics.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        'instagram.followers': {
                            count: profile.followers_count,
                            date: new Date()
                        },
                        'instagram.posts': processedPosts
                    },
                    $set: {
                        'instagram.bestTimes': bestTimes,
                        'instagram.topHashtags': topHashtags,
                        lastUpdated: new Date()
                    }
                },
                { upsert: true, new: true }
            );

            return analytics;
        } catch (error) {
            throw new Error('Failed to update analytics: ' + error.message);
        }
    }

    async getAnalyticsSummary(userId) {
        try {
            const analytics = await Analytics.findOne({ userId })
                .sort({ lastUpdated: -1 })
                .limit(1);

            if (!analytics) {
                throw new Error('No analytics data found');
            }

            return {
                followers: analytics.instagram.followers.slice(-7),
                engagement: analytics.instagram.engagement.slice(-7),
                bestTimes: analytics.instagram.bestTimes,
                topHashtags: analytics.instagram.topHashtags,
                recentPosts: analytics.instagram.posts.slice(-5)
            };
        } catch (error) {
            throw new Error('Failed to get analytics summary: ' + error.message);
        }
    }
}

module.exports = new AnalyticsService();