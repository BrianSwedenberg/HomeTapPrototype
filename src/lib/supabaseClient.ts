import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url) throw new Error('Missing VITE_SUPABASE_URL — check your .env.local file');
if (!key) throw new Error('Missing VITE_SUPABASE_ANON_KEY — check your .env.local file');

export const supabase = createClient(url, key);
