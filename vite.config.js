import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Custom dev middleware to handle /api/contact locally during npm run dev
function devApiPlugin(env) {
  return {
    name: 'dev-api-contact-middleware',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            process.env.RESEND_API_KEY = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
            process.env.CONTACT_RECIPIENT_EMAIL = env.CONTACT_RECIPIENT_EMAIL || process.env.CONTACT_RECIPIENT_EMAIL;

            const { default: handler } = await import('./api/contact.js');

            const mockRes = {
              status(code) {
                res.statusCode = code;
                return this;
              },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              },
              setHeader(k, v) {
                res.setHeader(k, v);
                return this;
              },
            };

            await handler({ ...req, body: parsed }, mockRes);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal dev server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiPlugin(env)],
    server: {
      port: 5173,
      strictPort: false,
    },
  };
});