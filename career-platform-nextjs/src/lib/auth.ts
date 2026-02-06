import { getUser, isAdmin as checkIsAdmin } from './supabase-server';

/**
 * 管理者かどうかを確認
 */
export async function isAdmin() {
  return await checkIsAdmin();
}

/**
 * 現在のユーザーを取得
 */
export async function getCurrentUser() {
  const user = await getUser();
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email,
    image: user.user_metadata?.avatar_url,
  };
}
