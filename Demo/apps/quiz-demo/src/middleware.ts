import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await auth();

  // List of protected paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/results'];

  // Check if the path is in the protected paths list and user isn't authenticated
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    // Redirect to login page if accessing protected route without authentication
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configure the matcher for paths where middleware should run
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
