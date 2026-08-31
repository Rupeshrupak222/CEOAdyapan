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
  
  // Determine target path
  let targetPath = searchParams.get('path') || url.pathname;
  if (targetPath === '/crm-frame' || targetPath === '/crm-proxy') {
    targetPath = '/';
  }
  if (!targetPath.startsWith('/')) {
    targetPath = `/${targetPath}`;
  }

  const targetUrl = new URL(targetPath, 'https://adyapancrm.in');

  // Forward query parameters (excluding the internal 'path' query param)
  searchParams.forEach((val, key) => {
    if (key !== 'path') {
      targetUrl.searchParams.set(key, val);
    }
  });

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // Exclude hop-by-hop and host headers
    if (!['host', 'connection'].includes(lowerKey)) {
      forwardHeaders.set(key, value);
    }
  });

  forwardHeaders.set('host', 'adyapancrm.in');
  forwardHeaders.set('origin', 'https://adyapancrm.in');
  forwardHeaders.set('referer', 'https://adyapancrm.in/');
  if (!forwardHeaders.has('user-agent')) {
    forwardHeaders.set(
      'user-agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    );
  }

  try {
    const body =
      req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.arrayBuffer()
        : undefined;

    const upstreamRes = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual',
    });

    const responseHeaders = new Headers();

    upstreamRes.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      // Strip framing restriction and CSP headers
      if (
        lower === 'x-frame-options' ||
        lower === 'content-security-policy' ||
        lower === 'content-security-policy-report-only'
      ) {
        return;
      }
      // Strip set-cookie here as we will process it separately
      if (lower === 'set-cookie') {
        return;
      }
      responseHeaders.set(key, val);
    });

    // Rewrite redirects to stay within the same origin
    const location = upstreamRes.headers.get('location');
    if (location) {
      const rewrittenLocation = location
        .replace(/^https?:\/\/adyapancrm\.in/i, '')
        .replace(/^\/crm-frame/i, '');
      responseHeaders.set('location', rewrittenLocation || '/');
    }

    // Process and rewrite cookies for iframe compatibility
    const rawCookies: string[] = [];
    if (typeof (upstreamRes.headers as any).getSetCookie === 'function') {
      rawCookies.push(...(upstreamRes.headers as any).getSetCookie());
    } else {
      const single = upstreamRes.headers.get('set-cookie');
      if (single) rawCookies.push(single);
    }

    rawCookies.forEach((cookieStr) => {
      let clean = cookieStr
        .replace(/Domain=[^;]+;?\s*/gi, '')
        .replace(/SameSite=[^;]+;?\s*/gi, '')
        .replace(/Secure;?\s*/gi, '')
        .trim();
      if (!clean.endsWith(';')) clean += ';';
      clean += ' SameSite=None; Secure; Path=/';
      responseHeaders.append('Set-Cookie', clean);
    });

    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new Response(
      `<html><body style="background:#020617;color:#f8fafc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;padding:24px;background:#0f172a;border-radius:12px;border:1px solid #1e293b;max-width:400px;">
          <h2 style="font-size:18px;margin-bottom:8px;">CRM Connection Error</h2>
          <p style="color:#94a3b8;font-size:13px;">${error?.message || 'Gateway communication failed'}</p>
          <a href="https://adyapancrm.in" target="_blank" style="display:inline-block;margin-top:16px;padding:8px 16px;background:#ea580c;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:13px;">Open Adyapan CRM Directly</a>
        </div>
      </body></html>`,
      {
        status: 502,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
