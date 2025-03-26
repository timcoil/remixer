// This file is for a Next.js API route, if you're using Next.js
// If using a different setup, you'd need to create your own API endpoint

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, remixType } = req.body;
    
    // Construct the prompt based on remix type
    let prompt = '';
    switch (remixType) {
      case 'summarize':
        prompt = `Please summarize the following text concisely:\n\n${text}`;
        break;
      case 'simplify':
        prompt = `Please rewrite the following text in simple, easy-to-understand language:\n\n${text}`;
        break;
      case 'professional':
        prompt = `Please rewrite the following text in a professional, formal style:\n\n${text}`;
        break;
      case 'creative':
        prompt = `Please rewrite the following text in a creative, engaging way:\n\n${text}`;
        break;
      default:
        prompt = `Please rewrite the following text:\n\n${text}`;
    }
    
    // Make call to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const data = await response.json();
    const result = data.content[0].text;
    
    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error processing remix request:', error);
    return res.status(500).json({ error: 'Failed to remix content' });
  }
} 