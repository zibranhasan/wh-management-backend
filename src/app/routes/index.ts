import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { authRoutes } from '../modules/Auth/auth.route';
import { InStcokRoutes } from '../modules/InStock/inStock.route';

import { BuyerRoutes } from '../modules/Buyer/buyer.routes';
import { stcokOutRoutes } from '../modules/stcokOut/stockOut..route';
import { prodcutRoute } from '../modules/product/product.route';

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
  {
    path: '/outStcok',
    route: stcokOutRoutes,
  },
  {
    path: '/buyer',
    route: BuyerRoutes,
  },
  {
    path: '/product',
    route: prodcutRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
