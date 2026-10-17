import { Env, json, requireAdmin } from '../../_lib/auth';

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const { user, error } = await requireAdmin(request, env);
  if (error) return error;

  const path = new URL(request.url).pathname;
  if (path === '/api/admin/stats') {
    return json({ ok: true, admin: user!.email, generatedAt: new Date().toISOString() });
  }
  return json({ error: 'Not found' }, 404);
};
