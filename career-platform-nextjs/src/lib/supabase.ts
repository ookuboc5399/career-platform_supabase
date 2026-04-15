import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 遅延初期化: ビルド時に環境変数が未設定でもモジュール読み込みでエラーにならないようにする
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
}

function getSupabaseServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';
}

// クライアント側用（anon key）
function createSupabaseClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      'Supabase credentials are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Environment Variables.'
    );
  }
  return createClient(url, key);
}

// サーバー側用（service role key）
function createSupabaseAdminClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  if (!url) {
    throw new Error(
      'Supabase URL is not configured. Set NEXT_PUBLIC_SUPABASE_URL in Vercel Environment Variables.'
    );
  }
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  // フォールバック: service role key がない場合は anon key を使用
  const anonKey = getSupabaseAnonKey();
  if (!anonKey) {
    throw new Error(
      'Supabase credentials are not configured. Set NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY) in Vercel Environment Variables.'
    );
  }
  return createClient(url, anonKey);
}

/** クライアント側用（anon key）。初回アクセス時に初期化 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabase) _supabase = createSupabaseClient();
    const value = (_supabase as Record<string, unknown>)[prop as string];
    return typeof value === 'function' ? value.bind(_supabase) : value;
  },
});

/** サーバー側用（service role key）。初回アクセス時に初期化 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    const value = (_supabaseAdmin as Record<string, unknown>)[prop as string];
    return typeof value === 'function' ? value.bind(_supabaseAdmin) : value;
  },
});

