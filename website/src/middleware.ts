import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';
import { userBasicInfoApi } from './service/user';
import { signOut } from 'next-auth/react';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const loginUrl = new URL("/auth/login", request.url);
  
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const userBasicInfo = await userBasicInfoApi(token.accessToken);

  if (!userBasicInfo || userBasicInfo.statusCode === 401) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|images|$).*)',
  ],
};
