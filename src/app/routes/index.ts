import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { authRoutes } from '../modules/Auth/auth.route';
import { InStcokRoutes } from '../modules/InStcok/inStcok.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/inStcok',
    route: InStcokRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
