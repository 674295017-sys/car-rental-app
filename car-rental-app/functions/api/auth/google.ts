import { Env, json, resolveRole, sessionCookie, signSession, verifyGoogleIdToken } from '../../_lib/auth';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const { credential } = (await request.json()) as { credential?: string };
    if (!credential) return json({ error: 'Missing credential' }, 400);

    const payload = await verifyGoogleIdToken(credential, env);
    const user = {
      email: payload.email.toLowerCase(),
      name: payload.name || payload.email,
      picture: payload.picture || '',
      role: resolveRole(payload.email, env),
    };
    const token = await signSession(user, env);
    return json({ user }, 200, { 'Set-Cookie': sessionCookie(token, request) });
  } catch (err) {
    return json({ error: 'INVALID_GOOGLE_TOKEN', detail: (err as Error).message }, 401);
  }
};
