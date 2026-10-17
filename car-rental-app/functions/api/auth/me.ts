import { Env, getSessionUser, json } from '../../_lib/auth';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const user = await getSessionUser(request, env);
  return json({ user });
};
