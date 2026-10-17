import { Env, clearCookie, json } from '../../_lib/auth';

export const onRequestPost = async ({ request }: { request: Request; env: Env }) =>
  json({ ok: true }, 200, { 'Set-Cookie': clearCookie(request) });
