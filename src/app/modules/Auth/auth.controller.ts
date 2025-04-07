import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { authService } from './auth.service';
import sendResponse from '../../utils/sendResponse';

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await authService.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated succesfully!',
    data: result,
  });
});

export const authController = {
  loginUser,
  getMe,
  forgetPassword,
};
