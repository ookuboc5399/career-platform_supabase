'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * クライアント側で使用するSupabaseクライアント
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

