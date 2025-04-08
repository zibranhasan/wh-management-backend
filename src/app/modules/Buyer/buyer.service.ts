import AppError from '../../errors/AppError';
import { TBuyer } from './buyer.interface';
import { Buyer } from './buyer.model';
import httpStatus from 'http-status';
const createBuyerIntoDb = async (payload: TBuyer) => {
  const { phone } = payload;

  const phoneNumber = await Buyer.findOne({ phone });
  if (phoneNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already exists');
  }
  const result = await Buyer.create(payload);
  return result;
};

const getAllBuyersFromDb = async () => {
  const result = await Buyer.find({}).sort({ createdAt: -1 });
  return result;
};
const getSingleBugerFromDb = async (payload: string) => {
  const result = await Buyer.findById({ _id: payload }).sort({ createdAt: -1 });
  return result;
};

export const buyerService = {
  createBuyerIntoDb,
  getAllBuyersFromDb,
  getSingleBugerFromDb,
};
