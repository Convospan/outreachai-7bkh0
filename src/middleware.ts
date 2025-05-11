import { authMiddleware } from "@clerk/nextjs/server";

// This example protects all routes including api/auth
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ['/','/pricing','/about','/contact', "/sitemap.xml", "/community-terms", "/terms-of-service", "/privacy-policy", "/refund-policy", "/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
