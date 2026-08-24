import { adminRoutes } from './collections/admin';
import { privateRoutes } from './collections/auth';
import { publicRoutes } from './collections/dashboard';
import { pagesRoutes } from './collections/pages';

export const allRoutes = [...adminRoutes, ...privateRoutes, ...publicRoutes, ...pagesRoutes];