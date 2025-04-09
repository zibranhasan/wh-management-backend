/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from './user.model';
import { IUser } from './user.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createSingupIntoDb = async (file: any, payload: IUser) => {
  if (file) {
    const imageName = `${payload?.name}`;
    const path = file?.path;

    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.image = secure_url as string;
  }

  const result = await User.create(payload);

  return result;
};

const singleUserDelete = async (payload: string) => {
  const isUser = await User.isUserExistsByEmail(payload);

  if (!isUser) {
    throw new Error('This user is not found');
  }
  const isDeleted = isUser?.isDeleted;
  if (isDeleted) {
    throw new Error('This user is already deleted');
  }

  const result = await User.findOneAndUpdate(
    { email: payload },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const userService = {
  createSingupIntoDb,
  singleUserDelete,
};
