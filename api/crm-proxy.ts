export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const rawPath = searchParams.get('path') || '';
  const subPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

  const targetUrl = new URL(subPath === '/' ? '' : subPath, 'https://adyapancrm.in');

  // Copy any other search parameters
  searchParams.forEach((val, key) => {
    if (key !== 'path') {
      targetUrl.searchParams.set(key, val);
    }
  });

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!['host', 'connection', 'content-length'].includes(lowerKey)) {
      forwardHeaders.set(key, value);
    }
  });

  forwardHeaders.set('host', 'adyapancrm.in');
  forwardHeaders.set('referer', 'https://adyapancrm.in/');
  forwardHeaders.set('origin', 'https://adyapancrm.in');
  forwardHeaders.set(
    'user-agent',
    req.headers.get('user-agent') ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  );

  try {
    const upstreamRes = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      redirect: 'manual',
    });

    const responseHeaders = new Headers();

    upstreamRes.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      // Strip framing restriction headers
      if (
        lower === 'x-frame-options' ||
        lower === 'content-security-policy' ||
        lower === 'content-security-policy-report-only'
      ) {
        return;
      }
      responseHeaders.set(key, val);
    });

    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

    // If HTML, inject base href and script to prevent breaking out
    const contentType = upstreamRes.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      let html = await upstreamRes.text();
      if (!html.includes('<base')) {
        html = html.replace(
          /<head>/i,
          '<head><base href="https://adyapancrm.in/" />'
        );
      }
      return new Response(html, {
        status: upstreamRes.status,
        headers: responseHeaders,
      });
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new Response(
      `<html><body style="background:#020617;color:#f8fafc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;padding:24px;background:#0f172a;border-radius:12px;border:1px solid #1e293b;">
          <h2>Unable to proxy CRM session</h2>
          <p style="color:#94a3b8;">${error?.message || 'Gateway error'}</p>
          <a href="https://adyapancrm.in" target="_blank" style="display:inline-block;margin-top:12px;padding:8px 16px;background:#ea580c;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Open Adyapan CRM Directly</a>
        </div>
      </body></html>`,
      {
        status: 502,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
