import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('api/proxy')
export class ProxyController {
  @Get('embed')
  async proxyEmbed(@Query('url') targetUrl: string, @Res() res: Response) {
    if (!targetUrl) {
      return res.status(400).send('Target URL required');
    }

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000,
        responseType: 'text',
      });

      // Remove X-Frame-Options and Content-Security-Policy from response
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');

      let html: string = response.data;
      const urlObj = new URL(targetUrl);
      const origin = urlObj.origin;

      // 1. Rewrite root-relative URLs for Next.js assets so chunks and images load from origin
      html = html
        .replace(/(href|src|poster)=["']\/([^"']+)["']/gi, `$1="${origin}/$2"`)
        .replace(/["']\/_next\/([^"']+)["']/gi, `"${origin}/_next/$1"`);

      // 2. Prevent logo / home navigation from breaking out to localhost or external sites
      html = html
        .replace(/href=["']https:\/\/ai\.adyapan\.com\/?["']/gi, 'href="javascript:void(0)"')
        .replace(/href=["']https:\/\/ai\.adyapan\.com\/#([^"']*)["']/gi, 'href="javascript:void(0)"')
        .replace(/href=["']\/["']/gi, 'href="javascript:void(0)"')
        .replace(/href=["']\/#([^"']*)["']/gi, 'href="javascript:void(0)"')
        .replace(/href=["']https:\/\/ai\.adyapan\.com\/login["']/gi, 'href="javascript:void(0)"');

      // 3. Inject base href and script to disable window.top breakout
      const breakoutGuard = `
        <base href="${origin}/">
        <script>
          // Prevent child frame from redirecting parent window
          try {
            window.top = window.self;
            window.parent = window.self;
          } catch(e) {}
          document.addEventListener('click', function(e) {
            var target = e.target.closest('a');
            if (target && (target.getAttribute('href') === '/' || target.getAttribute('href') === 'javascript:void(0)' || target.getAttribute('href') === '${origin}/' || target.getAttribute('href') === '${origin}')) {
              e.preventDefault();
              e.stopPropagation();
            }
          }, true);
        </script>
      `;

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${breakoutGuard}`);
      } else {
        html = breakoutGuard + '\n' + html;
      }

      return res.send(html);
    } catch (error: any) {
      return res.status(502).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #131b2e; border: 1px solid #1e293b; padding: 32px; border-radius: 16px; text-align: center; max-width: 440px; }
            h2 { margin: 0 0 8px 0; font-size: 20px; font-weight: 800; }
            p { font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; }
            a { background: #ea580c; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block; }
            a:hover { background: #f97316; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Launch Application</h2>
            <p>Direct browser-to-server connection required for this session.</p>
            <a href="${targetUrl}" target="_blank" rel="noopener noreferrer">Open in Dedicated Window ↗</a>
          </div>
        </body>
        </html>
      `);
    }
  }
}
