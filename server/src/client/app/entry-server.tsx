import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';
import { routes } from './routes';

export async function render(url: string): Promise<string> {
  const { query, dataRoutes } = createStaticHandler(routes);

  // Create a mock request for the static handler
  const fetchRequest = new Request(`http://localhost${url}`, {
    method: 'GET',
  });

  const context = await query(fetchRequest);

  // Handle redirects
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  const html = renderToString(
    <StaticRouterProvider router={router} context={context} />
  );

  return html;
}
