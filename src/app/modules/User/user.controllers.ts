import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
const Createsignup = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.file, 'req.file');
  // console.log(req.body, 'req.body');

  const result = await userService.createSingupIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const singleUserDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  const result = await userService.singleUserDeleteIntoDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
const getsingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.getsingleUserIntoDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const updateData = req.body;
  const result = await userService.updateUserInIntoDb(id, updateData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const getAlllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAlllUserIntoDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User Get successfully',
    data: result,
  });
});

export const userController = {
  Createsignup,
  singleUserDelete,
  updateUser,
  getAlllUser,
  getsingleUser,
};
