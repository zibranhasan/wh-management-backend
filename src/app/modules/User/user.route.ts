import express, { NextFunction, Request, Response } from 'express';

import { userValidationSchemas } from './user.validation';

import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controllers';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/signup',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidationSchemas.signupValidationSchema),
  userController.Createsignup,
);

export const userRoutes = router;
