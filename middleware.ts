import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter for auth endpoints.
 * Limits login/register attempts per IP to prevent brute-force attacks.
 */
const authAttempts = new Map<string, { count: number; resetAt: number }>();
const AUTH_RATE_LIMIT = 10;     // max attempts
const AUTH_RATE_WINDOW = 60_000; // per 60 seconds

function checkAuthRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = authAttempts.get(ip);

  if (!entry || now >= entry.resetAt) {
    authAttempts.set(ip, { count: 1, resetAt: now + AUTH_RATE_WINDOW });
    return false; // not limited
  }

  entry.count += 1;
  return entry.count > AUTH_RATE_LIMIT; // true = limited
}

// Periodic cleanup to prevent memory leak
if (typeof globalThis !== 'undefined') {
  const cleanup = () => {
    const now = Date.now();
    authAttempts.forEach((entry, key) => {
      if (now >= entry.resetAt) authAttempts.delete(key);
    });
  };
  // Note: In edge runtime, setInterval may not be available.
  // The map will self-clean on next access.
  try { setInterval(cleanup, 120_000); } catch {}
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Rate limit auth endpoints (POST to /giris and /kayit)
  if (
    (request.nextUrl.pathname === '/giris' || request.nextUrl.pathname === '/kayit') &&
    request.method === 'POST'
  ) {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (checkAuthRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Çok fazla deneme. Lütfen bir dakika bekleyin.' },
        { status: 429 }
      );
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes - require admin role
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/giris?redirect=/admin', request.url));
    }
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /hesabim routes
  if (request.nextUrl.pathname.startsWith('/hesabim') || request.nextUrl.pathname.startsWith('/siparis')) {
    if (!user) {
      // Validate redirect parameter — only allow internal paths
      const safePath = request.nextUrl.pathname;
      return NextResponse.redirect(new URL('/giris?redirect=' + encodeURIComponent(safePath), request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (user && (request.nextUrl.pathname === '/giris' || request.nextUrl.pathname === '/kayit')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

