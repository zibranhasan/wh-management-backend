import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.canstance';
import { buyerController } from './buyer.controller';
import { buyerValidationSchema } from './buyer.validation';
const router = Router();

router.post(
  '/createBuyer',
  auth(USER_ROLE.admin, USER_ROLE.user),
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
  '/BuyerbySalseman/:name',

  buyerController.getBySalseManName,
);

router.get(
  '/',

  buyerController.getAllBuyers,
);

export const BuyerRoutes = router;
