/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from './user.model';
import { IUser } from './user.interface';
// import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createSingupIntoDb = async (payload: IUser) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  const isUser = await User.isUserExistsByEmail(payload?.email);
  if (isUser) {
    throw new Error('This user is already exists');
  }

  // if (file) {
  //   const imageName = `${payload?.name}`;
  //   const path = file?.path;

  //   //send image to cloudinary
  //   const { secure_url } = await sendImageToCloudinary(imageName, path);
  //   payload.image = secure_url as string;
  // }
  payload.role = 'user';
  const result = await User.create(payload);

  return result;
};

const singleUserDeleteIntoDb = async (payload: string) => {
  // console.log(payload);

  const result = await User.findByIdAndUpdate(
    payload,
    { isDeleted: true },
    { new: true },
  );

  console.log(result);
  return result;
};

const getsingleUserIntoDb = async (payload: string) => {
  const isUser = await User.findById(payload);

  if (!isUser) {
    throw new Error('This user is not found');
  }
  const isDeleted = isUser?.isDeleted;
  if (isDeleted) {
    throw new Error('This user is already deleted');
  }

  return isUser;
};

const getAlllUserIntoDb = async () => {
  const result = await User.find({ isDeleted: false });

  return result;
};

const updateUserInIntoDb = async (stockInId: string, updateData: any) => {
  const result = await User.findOneAndUpdate(
    { _id: stockInId },
    { $set: updateData },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'user document not found');
  }

  return result;
};

export const userService = {
  createSingupIntoDb,
  singleUserDeleteIntoDb,
  getAlllUserIntoDb,
  updateUserInIntoDb,
  getsingleUserIntoDb,
};
