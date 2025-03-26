// This file is for a Next.js API route, if you're using Next.js
// If using a different setup, you'd need to create your own API endpoint
import Anthropic from '@anthropic-ai/sdk';

export default async function tweetsFromPost(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, remixType } = req.body;
    
    // Input validation
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    if (!remixType) {
      return res.status(400).json({ error: 'Remix type is required' });
    }
    
    // Log for debugging
    console.log(`Processing ${remixType} request for text: ${text.substring(0, 50)}...`);
    
    // Construct the prompt based on remix type
    let prompt = '';
    switch (remixType) {
      case 'summarize':
        prompt = `Convert the following text into 3-5 tweets, each STRICTLY under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'simplify':
        prompt = `Convert the following text into 3-5 tweets in simple, easy-to-understand language. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'professional':
        prompt = `Convert the following text into 3-5 tweets in a professional, formal style. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'creative':
        prompt = `Convert the following text into 3-5 tweets in a creative, engaging way. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'academic':
        prompt = `Convert the following text into 3-5 tweets in an academic style. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'technical':
        prompt = `Convert the following text into 3-5 tweets in a technical style suitable for documentation. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'marketing':
        prompt = `Convert the following text into 3-5 tweets as compelling marketing copy with clear value propositions. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      case 'friendly':
        prompt = `Convert the following text into 3-5 tweets in a friendly, casual tone. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
        break;
      default:
        prompt = `Convert the following text into 3-5 tweets. Each tweet MUST be under 280 characters. DO NOT include any hashtags (#) in any of the tweets. Format each tweet with "TWEET:" at the beginning and end each tweet with "ENDTWEET" so they can be clearly separated:

${text}`;
    }
    
    console.log('API Key available:', !!process.env.CLAUDE_API_KEY);
    
    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'API key not configured. Please set CLAUDE_API_KEY in .env.local' });
    }
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    
    // Make call to Claude API using the latest SDK
    console.log('Making request to Claude API...');
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // Using the current model version
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    
    console.log('Claude API response received');
    
    // Process the response
    let resultText = '';
    let tweets = [];
    
    if (response.content && Array.isArray(response.content) && response.content.length > 0) {
      // Extract text from content blocks
      resultText = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');
      
      // Extract tweets from the formatted response
      const tweetRegex = /TWEET:(.*?)ENDTWEET/gs;
      let match;
      while ((match = tweetRegex.exec(resultText)) !== null) {
        const tweetContent = match[1].trim();
        if (tweetContent) {
          tweets.push(tweetContent);
        }
      }
      
      // If no tweets were extracted with the regex, try a fallback method
      if (tweets.length === 0) {
        // Try splitting by newlines and filtering for potential tweets
        const lines = resultText.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          // Look for lines that might be tweets (not too short, not prefixed with common formatting)
          if (trimmedLine.length > 20 && trimmedLine.length <= 280 && 
              !trimmedLine.startsWith('TWEET') && !trimmedLine.startsWith('#') && 
              !trimmedLine.startsWith('```')) {
            tweets.push(trimmedLine);
          }
        }
      }
      
      // Remove any hashtags that might have been included
      tweets = tweets.map(tweet => {
        // Replace any hashtag word with the same word without the # symbol
        return tweet.replace(/#(\w+)/g, '$1');
      });
    } else {
      console.error('Unexpected API response format:', response);
      return res.status(500).json({ 
        error: 'Unexpected API response format',
        details: JSON.stringify(response)
      });
    }
    
    console.log('Successfully processed request');
    
    return res.status(200).json({ 
      result: resultText,
      tweets: tweets
    });
  } catch (error) {
    console.error('Error processing remix request:', error);
    return res.status(500).json({ 
      error: 'Failed to remix content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 