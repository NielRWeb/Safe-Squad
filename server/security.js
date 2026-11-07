/** Production policy and request-level protections. No student account lockouts. */
export const production = process.env.NODE_ENV === 'production';
let allowedOrigin = '';
if (production) {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'FRONTEND_ORIGIN'];
  const missing = required.filter(key => !process.env[key] || /^(your-mysql-password-here|changeme)$/i.test(process.env[key]));
  if (missing.length) throw new Error(`Missing or placeholder production configuration: ${missing.join(', ')}`);
  if (process.env.DB_USER.toLowerCase() === 'root') throw new Error('Production DB_USER must be a dedicated least-privilege account, not root.');
  if (!/^\d+$/.test(process.env.DB_PORT) || Number(process.env.DB_PORT) < 1 || Number(process.env.DB_PORT) > 65535) throw new Error('Invalid DB_PORT.');
  if (process.env.SESSION_COOKIE_SECURE !== 'true') throw new Error('Production requires SESSION_COOKIE_SECURE=true and HTTPS.');
  let url;
  try { url = new URL(process.env.FRONTEND_ORIGIN); } catch { throw new Error('FRONTEND_ORIGIN must be a valid HTTPS origin.'); }
  if (url.protocol !== 'https:' || url.origin !== process.env.FRONTEND_ORIGIN || url.username || url.password) throw new Error('FRONTEND_ORIGIN must be an exact HTTPS origin without a path.');
  allowedOrigin = url.origin;
}
if (process.env.SESSION_MINUTES && (!/^\d+$/.test(process.env.SESSION_MINUTES) || Number(process.env.SESSION_MINUTES) < 1 || Number(process.env.SESSION_MINUTES) > 480)) throw new Error('SESSION_MINUTES must be between 1 and 480.');

export function securityHeaders(req, res, next) {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'", 'Cache-Control': 'no-store' });
  if (production) res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

// Same-origin production deployment: do not send permissive CORS headers.
// Origin + custom header defend against cross-site form and fetch requests,
// including login CSRF. Requests without Origin are refused in production.
export function csrfGuard(req, res, next) {
  if (production && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (req.get('Origin') !== allowedOrigin || req.get('X-Safe-Squad-Request') !== '1') {
      return res.status(403).json({ error: 'Request origin not permitted.' });
    }
  }
  next();
}

// Admin-only, per source address, bounded in memory. Never keyed by LRN and never
// applied to student login. A production gateway must add distributed controls.
const attempts = new Map();
const WINDOW_MS = 15 * 60_000;
const LIMIT = 10;
export function limitAdminLogin(req, res, next) {
  const now = Date.now();
  for (const [key, value] of attempts) if (now >= value.reset) attempts.delete(key);
  const ip = req.socket.remoteAddress || 'unknown'; // do not trust forwarded headers from the client
  let bucket = attempts.get(ip);
  if (!bucket && attempts.size >= 10000) return res.status(503).json({ error: 'Admin login is busy. Please try later.' });
  if (!bucket) { bucket = { count: 0, reset: now + WINDOW_MS }; attempts.set(ip, bucket); }
  if (bucket.count >= LIMIT) {
    res.set('Retry-After', String(Math.max(1, Math.ceil((bucket.reset - now) / 1000))));
    return res.status(429).json({ error: 'Too many admin login attempts. Please try later.' });
  }
  bucket.count++;
  next();
}
