// backend/src/services/aiAnalysisService.js
const openAIService = require('./openaiService');
const instagramService = require('./instagramService');

class AIAnalysisService {
    async analyzeInstagramProfile(user) {
        try {
            // Get Instagram data
            const mediaData = await instagramService.getMediaData(user.instagram.accessToken);
            const profile = await instagramService.getUserProfile(user.instagram.accessToken);

            // Analyze posting patterns
            const postingPatterns = this.analyzePostingPatterns(mediaData.data);
            
            // Get engagement metrics
            const engagementMetrics = this.calculateEngagementMetrics(mediaData.data);

            // Generate AI insights
            const aiInsights = await this.generateAIInsights({
                profile,
                postingPatterns,
                engagementMetrics
            });

            return {
                insights: aiInsights,
                metrics: engagementMetrics,
                patterns: postingPatterns
            };
        } catch (error) {
            throw new Error('Failed to analyze Instagram profile');
        }
    }

    analyzePostingPatterns(posts) {
        // Analyze when posts are made and their performance
        const timeAnalysis = posts.reduce((acc, post) => {
            const postDate = new Date(post.timestamp);
            const hour = postDate.getHours();
            const day = postDate.getDay();

            if (!acc[`${day}-${hour}`]) {
                acc[`${day}-${hour}`] = {
                    posts: 0,
                    engagement: 0
                };
            }

            acc[`${day}-${hour}`].posts += 1;
            acc[`${day}-${hour}`].engagement += post.like_count + post.comments_count;

            return acc;
        }, {});

        return timeAnalysis;
    }

    calculateEngagementMetrics(posts) {
        const totalPosts = posts.length;
        const totalEngagement = posts.reduce((sum, post) => 
            sum + post.like_count + post.comments_count, 0
        );

        return {
            averageEngagement: totalPosts ? totalEngagement / totalPosts : 0,
            engagementRate: totalPosts ? (totalEngagement / totalPosts / profile.followers) * 100 : 0,
            bestPerformingPost: this.findBestPerformingPost(posts)
        };
    }

    async generateAIInsights(data) {
        try {
            const prompt = `Analyze this Instagram profile:
                Followers: ${data.profile.followers_count}
                Average engagement: ${data.metrics.averageEngagement}
                Best posting times: ${JSON.stringify(data.patterns)}
                
                Provide insights on:
                1. Content strategy
                2. Best posting times
                3. Engagement optimization
                4. Growth opportunities`;

            const insights = await openAIService.generateInsights(prompt);
            return insights;
        } catch (error) {
            throw new Error('Failed to generate AI insights');
        }
    }

    findBestPerformingPost(posts) {
        return posts.reduce((best, post) => {
            const engagement = post.like_count + post.comments_count;
            return engagement > best.engagement ? post : best;
        }, { engagement: 0 });
    }
}

module.exports = new AIAnalysisService();