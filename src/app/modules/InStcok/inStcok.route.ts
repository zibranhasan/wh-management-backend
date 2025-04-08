import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { stockInValidationSchema } from './inStock.validation';
import { inStcokController } from './inStockController';

const router = Router();

router.post(
  '/createInStcok',
  validateRequest(stockInValidationSchema),
  inStcokController.createInStcok,
);
router.delete(
  '/deleteProductFromStockIn/:stockInId/:productId',
  inStcokController.deleteProductFromStockIn,
);
router.get('/getAllInStcok', inStcokController.getAllInStcok);

export const InStcokRoutes = router;
