import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ipAddress } from "@vercel/edge";
import { isAllowed } from "./server/redis";

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
    // Optional: Add API routes if you want to enforce locale on them too
    '/api/agent/:path*',
  ],
};

function ipFallback(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  return xff
    ? Array.isArray(xff)
      ? (xff[0] as string)
      : xff.split(",")[0]
    : "127.0.0.1";
}

async function shouldRateLimit(request: NextRequest): Promise<boolean> {
  const ip = ipAddress(request) || ipFallback(request);
  if (!ip) {
    return false;
  }

  return !(await isAllowed(ip));
}

const rateLimitedResponse = () =>
  new Response("Too many requests, please try again later.", {
    status: 429,
  });

export async function middleware(request: NextRequest) {
  // Rate limiting check for API routes
  if (request.nextUrl.pathname.startsWith('/api/agent/')) {
    if (await shouldRateLimit(request)) {
      return rateLimitedResponse();
    }
  }

  // Force English locale for all routes
  if (!request.nextUrl.pathname.startsWith('/_next')) {
    const locale = 'en';
    request.nextUrl.searchParams.set('lng', locale);
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}
