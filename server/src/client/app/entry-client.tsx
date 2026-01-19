import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import './styles.css';

const router = createBrowserRouter(routes);

hydrateRoot(
  document.getElementById('root')!,
  <RouterProvider router={router} />
);
