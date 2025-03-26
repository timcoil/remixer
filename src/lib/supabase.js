import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we're in browser environment (needed to handle SSR in Next.js)
const isBrowser = typeof window !== 'undefined';

// Log for debugging (will only show in client-side)
if (isBrowser) {
  console.log('Supabase URL available:', !!supabaseUrl);
  console.log('Supabase Anon Key available:', !!supabaseAnonKey);
}

// Create Supabase client
let supabase = null;

try {
  if (isBrowser && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else if (isBrowser) {
    console.error('Supabase client initialization failed: Missing credentials');
  }
} catch (error) {
  if (isBrowser) {
    console.error('Error initializing Supabase client:', error);
  }
}

export default supabase; 