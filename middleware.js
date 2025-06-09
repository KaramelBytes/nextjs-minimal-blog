import { NextResponse } from 'next/server';

/**
 * Middleware function that applies security headers to all responses.
 * This runs on every request to enhance security and prevent common web vulnerabilities.
 * 
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} The response with security headers applied
 */
export function middleware(request) {
  const response = NextResponse.next();

  // Set security headers to protect against common web vulnerabilities
  // These headers help prevent clickjacking, XSS, MIME-type sniffing, and control referrer information
  response.headers.set('X-Content-Type-Options', 'nosniff');        // Prevent MIME-type sniffing
  response.headers.set('X-Frame-Options', 'DENY');                  // Prevent clickjacking attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');        // Enable XSS filtering in older browsers
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');  // Control referrer information
  
  // Define Content Security Policy to restrict resource loading
  // This helps prevent XSS, data injection, and other attacks
  const csp = [
    "default-src 'self'",              // Default policy for loading resources
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // Allow scripts from same origin and inline/eval (needed for some Next.js features)
    "style-src 'self' 'unsafe-inline'", // Allow styles from same origin and inline styles
    "img-src 'self' data: https:",      // Allow images from same origin, data URIs, and HTTPS sources
    "font-src 'self'",                  // Allow fonts from same origin
    "connect-src 'self' https:",         // Allow XHR/fetch to same origin and HTTPS
    "media-src 'self'",                 // Allow media from same origin
    "object-src 'none'",                // Disallow plugins (Flash, etc.)
    "frame-src 'none'"                  // Disallow iframes
  ].join('; ');
  
  // Apply the CSP header to the response
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

// Configuration for the Next.js middleware
export const config = {
  // Apply this middleware to all routes
  matcher: '/:path*',
};
