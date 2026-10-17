export interface Env {
  GOOGLE_CLIENT_ID: string;
  SESSION_SECRET: string;
  ADMIN_EMAILS?: string;
  AI?: { run: (model: string, input: unknown) => Promise<any> };
}

export type Role = 'admin' | 'user';

export interface SessionUser {
  email: string;
  name: string;
  picture: string;
  role: Role;
}

const DEFAULT_ADMINS = ['674295017@parichat.skru.ac.th', 'seree999@gmail.com'];
const COOKIE_NAME = 'de_session';
const SESSION_TTL_SEC = 60 * 60 * 8; // 8 hours

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

export function getAdminEmails(env: Env): string[] {
  const list = env.ADMIN_EMAILS
    ? env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_ADMINS;
  return list;
}

export function resolveRole(email: string, env: Env): Role {
  return getAdminEmails(env).includes(email.toLowerCase()) ? 'admin' : 'user';
}

// ---------- base64url helpers ----------
const b64urlToBytes = (s: string): Uint8Array<ArrayBuffer> => {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};
const bytesToB64url = (bytes: Uint8Array): string => {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const strToB64url = (s: string) => bytesToB64url(new TextEncoder().encode(s));
const b64urlToJson = (s: string) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

// ---------- Google ID token verification ----------
let jwksCache: { keys: any[]; exp: number } | null = null;

async function getGoogleJwks(): Promise<any[]> {
  if (jwksCache && jwksCache.exp > Date.now()) return jwksCache.keys;
  const res = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  if (!res.ok) throw new Error('Unable to fetch Google JWKS');
  const body = (await res.json()) as { keys: any[] };
  jwksCache = { keys: body.keys, exp: Date.now() + 60 * 60 * 1000 };
  return body.keys;
}

export async function verifyGoogleIdToken(idToken: string, env: Env) {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [h, p, s] = parts;
  const header = b64urlToJson(h);
  const payload = b64urlToJson(p);

  if (header.alg !== 'RS256') throw new Error('Unexpected alg');
  const jwk = (await getGoogleJwks()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('Unknown key id');

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(s),
    new TextEncoder().encode(`${h}.${p}`)
  );
  if (!ok) throw new Error('Invalid signature');

  const now = Math.floor(Date.now() / 1000);
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss))
    throw new Error('Invalid issuer');
  if (payload.aud !== env.GOOGLE_CLIENT_ID) throw new Error('Invalid audience');
  if (typeof payload.exp !== 'number' || payload.exp < now) throw new Error('Token expired');
  if (payload.email_verified !== true && payload.email_verified !== 'true')
    throw new Error('Email not verified');

  return payload as { email: string; name?: string; picture?: string };
}

// ---------- Session JWT (HS256) ----------
async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(user: SessionUser, env: Env): Promise<string> {
  if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET not configured');
  const now = Math.floor(Date.now() / 1000);
  const h = strToB64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = strToB64url(JSON.stringify({ ...user, iat: now, exp: now + SESSION_TTL_SEC }));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(env.SESSION_SECRET), new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${bytesToB64url(new Uint8Array(sig))}`;
}

async function verifySession(token: string, env: Env): Promise<SessionUser | null> {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s || !env.SESSION_SECRET) return null;
    const ok = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(env.SESSION_SECRET),
      b64urlToBytes(s),
      new TextEncoder().encode(`${h}.${p}`)
    );
    if (!ok) return null;
    const payload = b64urlToJson(p);
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    // Re-resolve role on every request so admin list changes apply immediately
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: resolveRole(payload.email, env),
    };
  } catch {
    return null;
  }
}

export function sessionCookie(token: string, request: Request): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SEC}${secure}`;
}

export function clearCookie(request: Request): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

export async function getSessionUser(request: Request, env: Env): Promise<SessionUser | null> {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? verifySession(match[1], env) : null;
}

export async function requireUser(request: Request, env: Env) {
  const user = await getSessionUser(request, env);
  if (!user) return { user: null, error: json({ error: 'UNAUTHENTICATED' }, 401) };
  return { user, error: null };
}

export async function requireAdmin(request: Request, env: Env) {
  const { user, error } = await requireUser(request, env);
  if (error) return { user: null, error };
  if (user!.role !== 'admin') return { user: null, error: json({ error: 'FORBIDDEN' }, 403) };
  return { user, error: null };
}
