// backend/src/services/openaiService.js
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateContentIdeas(niche, audience) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a social media content strategist specializing in Instagram."
          },
          {
            role: "user",
            content: `Generate 5 creative Instagram post ideas for a ${niche} account targeting ${audience}. Include caption suggestions and hashtag recommendations.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('Failed to generate content ideas');
    }
  }

  async generateCaption(context) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert Instagram caption writer."
          },
          {
            role: "user",
            content: `Write an engaging Instagram caption for: ${context}. Include relevant emojis and hashtag suggestions.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('Failed to generate caption');
    }
  }

  async suggestHashtags(content) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a hashtag optimization expert for Instagram."
          },
          {
            role: "user",
            content: `Suggest relevant hashtags for this content: ${content}. Include a mix of popular and niche-specific hashtags.`
          }
        ],
        temperature: 0.6,
        max_tokens: 200
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('Failed to suggest hashtags');
    }
  }

  async analyzeContent(content, instagramData) {
    try {
        // Use Instagram data for better analysis
        const userEngagement = instagramData.averageEngagement;
        const bestPerformingTimes = instagramData.bestTimes;
        const audienceData = instagramData.audienceInsights;

        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are analyzing content for an Instagram account with:
                        - Average engagement rate: ${userEngagement}%
                        - Best performing times: ${bestPerformingTimes}
                        - Audience demographics: ${audienceData}`
                },
                {
                    role: "user",
                    content: `Analyze this content: ${content}`
                }
            ]
        });

        // Process AI response based on real Instagram data
        return {
            engagementScore: calculateEngagementPotential(content, instagramData),
            bestTime: analyzeBestPostingTime(instagramData.postTimings),
            audienceInsights: generateAudienceInsights(instagramData.demographics),
            suggestions: generateContentSuggestions(instagramData.performance)
        };
    } catch (error) {
        throw error;
    }
}
}

module.exports = new OpenAIService();