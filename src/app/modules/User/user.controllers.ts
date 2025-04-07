import { Request, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
const Createsignup = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file);
  console.log(req.body);

  const result = await userService.createSingupIntoDb(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const userController = {
  Createsignup,
};
