import { createClient } from '@supabase/supabase-js';

// Log environment variables without exposing full keys
console.log('NEXT_PUBLIC_SUPABASE_URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Initialize Supabase client with better error handling
let supabase;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    console.log('Supabase client initialized successfully');
  } else {
    console.error('Missing Supabase credentials in environment variables');
  }
} catch (initError) {
  console.error('Failed to initialize Supabase client:', initError);
}

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    
    // Input validation
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Tweet content is required' });
    }
    
    // Check if Supabase client was initialized
    if (!supabase) {
      return res.status(500).json({ 
        error: 'Supabase client not initialized', 
        details: 'Please check your environment variables'
      });
    }
    
    console.log('Attempting to save tweet to Supabase...');
    console.log('Content:', content);
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('saved_tweets')
      .insert([
        { 
          content,
          created_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        statusCode: error.statusCode
      });
      
      return res.status(500).json({ 
        error: 'Failed to save tweet', 
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }
    
    console.log('Tweet saved successfully');
    
    return res.status(200).json({ success: true, tweet: data?.[0] || null });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Failed to process request', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 