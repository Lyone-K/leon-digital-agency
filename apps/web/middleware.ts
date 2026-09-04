import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/portal(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req) && !req.nextUrl.pathname.startsWith('/portal/sign-in') && !req.nextUrl.pathname.startsWith('/portal/sign-up')) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|studio|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
