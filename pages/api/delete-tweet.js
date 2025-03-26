import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow DELETE method
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Tweet ID is required' });
    }
    
    // Delete from Supabase
    const { error } = await supabase
      .from('saved_tweets')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete tweet', details: error.message });
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting tweet:', error);
    return res.status(500).json({ error: 'Failed to process request', message: error.message });
  }
} 