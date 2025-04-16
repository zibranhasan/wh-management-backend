import { Router } from 'express';
import { productController } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { productValidationSchema } from '../InStock/inStock.validation';

const router = Router();

router.post(
  '/',
  validateRequest(productValidationSchema),
  productController.createProduct,
);
router.get(
  '/',

  productController.getAllProduct,
);

export const prodcutRoute = router;
