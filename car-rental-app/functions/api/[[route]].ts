interface EventContext {
  request: Request;
  env: Record<string, any>;
  params: Record<string, any>;
}

export const onRequest = async (context: EventContext): Promise<Response> => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const method = context.request.method;

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
    'Content-Type': 'application/json',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Healthcheck endpoint for CI/CD
  if (path === '/api/health') {
    return new Response(
      JSON.stringify({
        status: 'UP',
        service: 'DriveEase Car Rental Edge API',
        timestamp: new Date().toISOString(),
        cloudflareEdge: true,
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Vehicles endpoint
  if (path.startsWith('/api/vehicles')) {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cloudflare Pages Functions API is active',
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  return new Response(
    JSON.stringify({
      error: 'Endpoint not found',
      path,
    }),
    { status: 404, headers: corsHeaders }
  );
};
