import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, allow all requests.
  // Implement Firebase-based authentication checks here if needed after core issues are resolved.
  // Example:
  // const isAuthenticated = checkFirebaseAuthentication(request); // Your custom auth check
  // if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/public-route') && !request.nextUrl.pathname.startsWith('/sign-in')) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
