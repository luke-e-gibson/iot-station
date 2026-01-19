import { Router, static as expressStatic } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

// Export a function to setup the router with Vite middleware
export async function createClientRouter() {
  const router = Router();
  
  if (!isProduction) {
    // Development: use Vite dev server
    const { createServer: createViteServer } = await import('vite');
    
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, '../../vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'custom',
    });

    router.use(vite.middlewares);

    // SSR handler for all routes
    router.get('/{*splat}', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        // Read and transform template with Vite
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);

        // Load the server entry module
        const { render } = await vite.ssrLoadModule('/app/entry-server.tsx');

        // Render the app HTML
        const appHtml = await render(url);

        // Inject rendered HTML into template
        const html = template.replace('<!--ssr-outlet-->', appHtml);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        // Handle redirects from React Router
        if (e instanceof Response) {
          const location = e.headers.get('Location');
          if (location) {
            res.redirect(e.status, location);
            return;
          }
        }

        vite.ssrFixStacktrace(e as Error);
        console.error(e);
        next(e);
      }
    });
  } else {
    // Production: serve static files and use pre-built SSR
    const clientDist = path.resolve(__dirname, '../../dist/client');
    
    // Serve static assets
    router.use(expressStatic(clientDist, { index: false }));

    // SSR handler
    router.get('/{*splat}', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const template = fs.readFileSync(
          path.resolve(clientDist, 'index.html'),
          'utf-8'
        );

        // Dynamic import of the built server entry
        const { render } = await import(
          /* @vite-ignore */
          path.resolve(__dirname, '../../dist/server/entry-server.js')
        );

        const appHtml = await render(url);
        const html = template.replace('<!--ssr-outlet-->', appHtml);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        if (e instanceof Response) {
          const location = e.headers.get('Location');
          if (location) {
            res.redirect(e.status, location);
            return;
          }
        }

        console.error(e);
        next(e);
      }
    });
  }

  return router;
}
