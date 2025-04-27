/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser } from '../User/user.interface';
import { User } from '../User/user.model';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is NotFound');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is Deleted');
  }

  //cheaking if the user is  already deleted

  // const isPasswordMatch=

  // console.log(isPasswordMatch)

  //      console.log(isUserExists?.password)
  if (!(await User.isPasswordMatch(payload.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Invaild');
  }

  const jwtPayload: any = {
    userId: user?._id,
    email: user?.email,
    role: user?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    data: user,
  };
};

const getMe = async (userId: string) => {
  // console.log(userId, 'bal');
  const result = await User.findById(userId);
  console.log(result);
  return result;
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const jwtPayload: any = {
    userId: user?._id,
    role: user?.role,
    email: user?.email,
  };

  const resetToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);

  console.log(resetUILink);
};

export const authService = {
  loginUser,
  getMe,
  forgetPassword,
};
