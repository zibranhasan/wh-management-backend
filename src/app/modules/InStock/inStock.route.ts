import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  stockInValidationSchema,
  updateProductValidationSchema,
  updateStockInValidationSchema,
} from './inStock.validation';
import { inStockController } from './inStockController';

const router = Router();

router.post(
  '/createInStock',
  validateRequest(stockInValidationSchema),
  inStockController.createInStock,
);
router.put(
  '/:stockInId',
  validateRequest(updateStockInValidationSchema),
  inStockController.updateInStock,
);
router.delete('/:stockInId', inStockController.deleteStockFromStockIn);
router.put(
  '/updateProductFromStockIn/:stockInId/:productId',
  validateRequest(updateProductValidationSchema),
  inStockController.updateProductInStock,
);
router.delete(
  '/deleteProductFromStockIn/:stockInId/:productId',
  inStockController.deleteProductFromStockIn,
);

router.get('/getAllInStcok', inStockController.getAllInStock);

export const InStcokRoutes = router;
