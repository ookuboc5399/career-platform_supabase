import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // /admin または /api/admin パスのみを処理
  if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) {
    // /admin 以外のパスでは何もせずに通過
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /admin ページへのアクセス制御
  if (path.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(redirectUrl);
    }

    // 管理者権限のチェック（環境変数で指定されたメールアドレスを確認）
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const trimmedAdminEmails = adminEmails.map(email => email.trim());
    if (!trimmedAdminEmails.includes(user.email || '')) {
      const redirectUrl = new URL('/auth/unauthorized', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // /api/admin エンドポイントへのアクセス制御
  if (path.startsWith('/api/admin')) {
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const trimmedAdminEmails = adminEmails.map(email => email.trim());
    if (!trimmedAdminEmails.includes(user.email || '')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
