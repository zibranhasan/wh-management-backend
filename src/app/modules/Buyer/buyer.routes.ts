import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { buyerValidationSchema } from './buyer.validation';
import { buyerController } from './buyer.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.canstance';

const router = Router();

router.post(
  '/createBuyer',
  validateRequest(buyerValidationSchema.createValidationSchema),
  buyerController.createBuyer,
);

router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),

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
