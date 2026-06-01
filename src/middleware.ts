import { NextResponse, type NextRequest } from 'next/server';
import { Role } from '@/types/enum';

const SETUP_COOKIE_NAME = 'org_setup_complete';
const ROLE_COOKIE_CANDIDATES = ['tracker_role', 'user_role', 'role'];
const TOKEN_COOKIE_CANDIDATES = [
  'tracker_token',
  'accessToken',
  'access_token',
  'token',
];

function readSetupStatus(request: NextRequest): boolean {
  return request.cookies.get(SETUP_COOKIE_NAME)?.value === 'true';
}

function decodeJwtRole(token: string): string | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const normalizedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload =
      normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
    const payload = JSON.parse(atob(paddedPayload)) as {
      role?: string;
    };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

function readRole(request: NextRequest): string | null {
  for (const cookieName of ROLE_COOKIE_CANDIDATES) {
    const cookieValue = request.cookies.get(cookieName)?.value;
    if (cookieValue) {
      return cookieValue;
    }
  }

  for (const cookieName of TOKEN_COOKIE_CANDIDATES) {
    const tokenValue = request.cookies.get(cookieName)?.value;
    if (!tokenValue) {
      continue;
    }

    const role = decodeJwtRole(tokenValue);
    if (role) {
      return role;
    }
  }

  return null;
}

function isBlockedRoute(role: string, pathname: string): boolean {
  if (pathname.startsWith('/dashboard/branches')) {
    return role !== Role.OWNER;
  }

  if (pathname.startsWith('/dashboard/departments')) {
    return role === Role.DEPT_MANAGER || role === Role.MEMBER;
  }

  if (pathname.startsWith('/dashboard/categories')) {
    return role === Role.DEPT_MANAGER || role === Role.MEMBER;
  }

  if (pathname.startsWith('/dashboard/members')) {
    return role === Role.MEMBER;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = readRole(request);
  const isSetupComplete = readSetupStatus(request);
  const isSetupRoute = pathname.startsWith('/setup/categories');
  const isAcceptInvitationRoute = pathname.startsWith('/accept-invitation');

  if (isAcceptInvitationRoute) {
    return NextResponse.next();
  }

  if (role && isBlockedRoute(role, pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isSetupRoute && role === Role.MEMBER) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    isSetupRoute &&
    role === Role.BRANCH_MANAGER &&
    isSetupComplete
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/setup/categories', '/accept-invitation'],
};
