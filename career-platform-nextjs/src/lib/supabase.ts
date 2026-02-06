import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

// クライアント側用（anon key）
export const supabase = createClient(supabaseUrl, supabaseKey);

// サーバー側用（service role key、必要に応じて）
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set. Some server-side operations may fail.');
  console.warn('Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local file.');
}

export const supabaseAdmin = supabaseServiceKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : (() => {
      console.warn('⚠️ Using anon key for admin operations. This may cause permission issues.');
      return supabase; // フォールバック: service role keyがない場合は通常のクライアントを使用
    })();

