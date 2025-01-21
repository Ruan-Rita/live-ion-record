// import type { NextRequest } from 'next/server';

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   if (!isAuthenticated(request)) {
//     // Respond with JSON indicating an error message
//     return Response.json(
//       { success: false, message: 'authentication failed' },
//       { status: 401 }
//     );
//   }
// }
// function isAuthenticated(request: NextRequest) {
//   console.log(request);

//   return false;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!|_next/static|_next/image|favicon.ico).*)',
//   ],
// };
