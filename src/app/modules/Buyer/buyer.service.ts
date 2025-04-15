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
  const result = await Buyer.find({ isDeleted: false }).sort({ createdAt: -1 });
  return result;
};
const getSingleBugerFromDb = async (payload: string) => {
  const result = await Buyer.findById({ _id: payload }).sort({ createdAt: -1 });
  return result;
};

const deleteBuyerFromDb = async (payload: string) => {
  const result = await Buyer.findByIdAndUpdate(
    { _id: payload },

    { isDeleted: true },

    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
  }
  return result;
};

const updateBuyerDueAmountFromDb = async (id: string, payload: string) => {
  const paymentAmount = parseFloat(payload);

  const buyer = await Buyer.findOne({ _id: id, isDeleted: false });
  console.log(buyer);
  if (!buyer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
  }

  buyer.totalDue = Math.max(0, (buyer.totalDue ?? 0) - paymentAmount);

  await buyer.save();

  return buyer;
};

export const buyerService = {
  createBuyerIntoDb,
  getAllBuyersFromDb,
  getSingleBugerFromDb,
  deleteBuyerFromDb,
  updateBuyerDueAmountFromDb,
};
