const ADMIN_HOSTS = new Set(['resume-dck.pages.dev']);
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function secureHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob: https:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests");
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=(), usb=()');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.pathname === '/aadmin-ck' || url.pathname.startsWith('/aadmin-ck/')) {
    if (!ADMIN_HOSTS.has(url.hostname)) return secureHeaders(new Response('Not found', { status: 404 }));
    if (MUTATING_METHODS.has(request.method) && request.headers.get('Origin') !== url.origin) {
      return secureHeaders(new Response('Forbidden', { status: 403 }));
    }
  }
  return secureHeaders(await next());
}
