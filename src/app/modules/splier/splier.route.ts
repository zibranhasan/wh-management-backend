import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createValidationSchema } from '../Buyer/buyer.validation';
import { splierController } from './spiler.controller';

const router = Router();

router.post(
  '/createSplier',
  validateRequest(createValidationSchema),
  splierController.createSplier,
);
router.get(
  '/',

  splierController.getAllSplier,
);
router.get(
  '/:id',

  splierController.getSingelSplier,
);
router.delete(
  '/:id',

  splierController.deleteSingelSplier,
);
router.put(
  '/:id',

  splierController.updateSingelSplier,
);

export const splierRoute = router;
