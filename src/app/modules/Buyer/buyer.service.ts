import AppError from '../../errors/AppError';
import { TBuyer } from './buyer.interface';
import { Buyer } from './buyer.model';
import httpStatus from 'http-status';
import { StockOut } from '../StockOut/stockOut.model';

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

  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment amount must be a positive number',
    );
  }

  const buyer = await Buyer.findOne({ _id: id, isDeleted: false });
  if (!buyer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
  }

  if (paymentAmount > buyer.totalDue) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment amount cannot be greater than total due amount',
    );
  }

  // Update buyer's due amount
  buyer.totalDue = Math.max(0, (buyer.totalDue ?? 0) - paymentAmount);
  await buyer.save();

  // Find and update related stock out records
  const stockOutRecords = await StockOut.find({
    buyerName: id,
    isDeleted: false,
    dueAmount: { $gt: 0 },
  }).sort({ createdAt: 1 });

  let remainingPayment = paymentAmount;

  for (const record of stockOutRecords) {
    if (remainingPayment <= 0) break;

    const paymentToApply = Math.min(remainingPayment, record.dueAmount);
    record.paidAmount += paymentToApply;
    record.dueAmount -= paymentToApply;
    remainingPayment -= paymentToApply;

    await record.save();
  }

  return buyer;
};

export const buyerService = {
  createBuyerIntoDb,
  getAllBuyersFromDb,
  getSingleBugerFromDb,
  deleteBuyerFromDb,
  updateBuyerDueAmountFromDb,
};
