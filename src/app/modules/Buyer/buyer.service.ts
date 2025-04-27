import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { StockOut } from '../stcokOut/stockOut.model';
import { TBuyer } from './buyer.interface';
import { Buyer } from './buyer.model';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createBuyerIntoDb = async (payload: TBuyer) => {
  const { phone } = payload;

  const phoneNumber = await Buyer.findOne({ phone });
  if (phoneNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already exists');
  }
  const result = await Buyer.create(payload);
  return result;
};

const getAllBuyersFromDb = async ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const BuyerSearchableFileds = ['name', 'phone', 'adress'];

  const BuyerQuery = new QueryBuilder(
    Buyer.find({ isDeleted: false }),

    query,
  )
    .search(BuyerSearchableFileds)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await BuyerQuery.countTotal();
  const result = await BuyerQuery.modelQuery;

  return {
    meta,
    result,
  };
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

const updateBuyerDueAmountFromDb = async (
  id: string,
  payload: { paidAmount: number },
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paidAmount } = payload;
    console.log(payload);

    const buyer = await Buyer.findById({ _id: id, isDeleted: false }).session(
      session,
    );

    console.log(buyer);
    if (!buyer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
    }

    // Ensure paymentHistory is initialized
    if (!buyer.paymentHistory) {
      buyer.paymentHistory = [];
    }

    if (paidAmount > (buyer.totalDue ?? 0)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Payment amount cannot be greater than total due amount',
      );
    }

    // Update buyer's due amount
    buyer.totalDue = Math.max(0, (buyer.totalDue ?? 0) - paidAmount);
    buyer.totalPay = Math.max(0, (buyer.totalPay ?? 0) + paidAmount);

    buyer.paymentHistory.push({
      amount: paidAmount,
      date: new Date(),
    });

    await buyer.save({ session });
    // Find and update related stock out records
    const stockOutRecords = await StockOut.find({
      buyerName: id,
      isDeleted: false,
      dueAmount: { $gt: 0 },
    })
      .sort({ createdAt: 1 })
      .session(session);

    let remainingPayment = paidAmount;

    for (const record of stockOutRecords) {
      if (remainingPayment <= 0) break;

      const dueAmount = record.dueAmount ?? 0;
      const paymentToApply = Math.min(remainingPayment, dueAmount);
      record.paidAmount = (record.paidAmount ?? 0) + paymentToApply;
      record.dueAmount = dueAmount - paymentToApply;
      remainingPayment -= paymentToApply;

      await record.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return buyer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const buyerService = {
  createBuyerIntoDb,
  getAllBuyersFromDb,
  getSingleBugerFromDb,
  deleteBuyerFromDb,
  updateBuyerDueAmountFromDb,
};
