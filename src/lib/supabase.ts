import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://vdvqkzgefcmfptafqqdi.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdnFremdlZmNtZnB0YWZxcWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjkwNDMsImV4cCI6MjA5NzI0NTA0M30.3MYJGXwGnUtHB2kwFHFhvEn69Y33aB596o9AqnNcnys';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/, '') : '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Determine if Supabase is properly configured in env variables
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('your-supabase') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('your-supabase') &&
    !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Track dynamic connection health state
let connectionHealthyState = false;
let connectionChecked = false;

export function getSupabaseConnectionHealth(): boolean {
  return connectionHealthyState;
}

export function isSupabaseConnectionChecked(): boolean {
  return connectionChecked;
}

export async function checkSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    connectionHealthyState = false;
    connectionChecked = true;
    return false;
  }

  try {
    // Check Supabase Auth service connectivity
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase auth session check failed:', error.message);
      connectionHealthyState = false;
    } else {
      console.log('Supabase connection verified successfully.');
      connectionHealthyState = true;
    }
  } catch (err) {
    console.error('Supabase network connection failed:', err);
    connectionHealthyState = false;
  }
  
  connectionChecked = true;
  return connectionHealthyState;
}
