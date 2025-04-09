import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { buyerValidationSchema } from './buyer.validation';
import { buyerController } from './buyer.controller';

const router = Router();

router.post(
  '/createBuyer',
  validateRequest(buyerValidationSchema.createValidationSchema),
  buyerController.createBuyer,
);

router.put(
  '/:id',

  buyerController.updateBuyerDueAmount,
);
router.delete(
  '/:id',

  buyerController.deleteBuyer,
);

router.get(
  '/:id',

  buyerController.getSingleBuyer,
);

router.get(
  '/',

  buyerController.getAllBuyers,
);

export const BuyerRoutes = router;
