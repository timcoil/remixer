import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Simply return the environment variables status
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Log environment variables without exposing the actual values
    console.log('Supabase URL available:', !!supabaseUrl);
    console.log('Supabase Key available:', !!supabaseKey);
    
    return res.status(200).json({
      status: 'success',
      message: 'Environment variables check',
      details: {
        url_configured: !!supabaseUrl,
        key_configured: !!supabaseKey
      }
    });
  } catch (error) {
    console.error('Error in check-supabase endpoint:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Error checking Supabase configuration',
      details: {
        error_message: error.message
      }
    });
  }
} 