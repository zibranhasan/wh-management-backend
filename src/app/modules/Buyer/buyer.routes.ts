import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { buyerValidationSchema } from './buyer.validation';
import { buyerController } from './Buyer.controller';

const router = Router();

router.post(
  '/createBuyer',
  validateRequest(buyerValidationSchema.createValidationSchema),
  buyerController.createBuyer,
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
