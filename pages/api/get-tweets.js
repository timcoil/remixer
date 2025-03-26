import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get saved tweets from Supabase
    const { data, error, count } = await supabase
      .from('saved_tweets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to retrieve tweets', details: error.message });
    }
    
    return res.status(200).json({ 
      success: true, 
      tweets: data || [],
      count: count || 0
    });
  } catch (error) {
    console.error('Error retrieving tweets:', error);
    return res.status(500).json({ error: 'Failed to process request', message: error.message });
  }
} 