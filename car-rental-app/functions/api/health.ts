import { json } from '../_lib/auth';

export const onRequestGet = async () =>
  json({ status: 'UP', service: 'DriveEase Edge API', timestamp: new Date().toISOString() });
