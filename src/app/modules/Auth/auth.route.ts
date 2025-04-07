import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { authController } from './auth.controller';
import { userValidationSchemas } from '../User/user.validation';
import { USER_ROLE } from '../User/user.canstance';
import auth from '../../middlewares/auth';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(userValidationSchemas.loginValidationSchema),
  authController.loginUser,
);
router.get(
  '/getMe',
  auth(USER_ROLE.admin, USER_ROLE.user),
  authController.getMe,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  authController.forgetPassword,
);

export const authRoutes = router;
