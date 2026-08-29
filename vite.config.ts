import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      // CRM Portal Frame Route
      '/crm-frame': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: {
          '*': 'localhost',
        },
        cookiePathRewrite: '/',
        rewrite: (path) => path.replace(/^\/crm-frame/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['content-security-policy-report-only'];

            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map((c: string) => {
                return c
                  .replace(/Domain=[^;]+;?/gi, '')
                  .replace(/SameSite=Lax/gi, 'SameSite=None; Secure')
                  .replace(/SameSite=Strict/gi, 'SameSite=None; Secure');
              });
            }
          });
        },
      },
      // CRM Navigation Routes
      '/admin': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
          });
        },
      },
      '/dashboard': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
          });
        },
      },
      '/sales': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/leads': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/students': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/payments': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/payroll': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/managers': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/team-leaders': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/employees': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/attendance': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/leaves': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      // CRM Next.js general static chunks & images
      '/_next': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/newlogo.png': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/login_background.png': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/api/auth': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
      '/api/admin': {
        target: 'https://adyapancrm.in',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
