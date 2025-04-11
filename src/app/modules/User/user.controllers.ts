import { Request, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
const Createsignup = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file, 'req.file');
  console.log(req.body, 'req.body');

  const result = await userService.createSingupIntoDb(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const singleUserDelete = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;

  const result = await userService.singleUserDelete(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  Createsignup,
  singleUserDelete,
};
