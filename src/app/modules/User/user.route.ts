import express from 'express';

import { userValidationSchemas } from './user.validation';

import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controllers';
// import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/signup',
  // upload.single('file'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = JSON.parse(req.body.data);
  //   next();
  // },
  validateRequest(userValidationSchemas.signupValidationSchema),
  userController.Createsignup,
);
router.delete(
  '/:id',

  userController.singleUserDelete,
);
router.put(
  '/:id',

  userController.updateUser,
);
router.get(
  '/:id',

  userController.getsingleUser,
);
router.get(
  '/',

  userController.getAlllUser,
);

export const userRoutes = router;
