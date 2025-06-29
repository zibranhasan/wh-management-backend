import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { StockOut } from '../stcokOut/stockOut.model';
import { User } from '../User/user.model';
import { TBuyer } from './buyer.interface';
import { Buyer } from './buyer.model';

const createBuyerIntoDb = async (payload: TBuyer, userId: string) => {
  const { phone } = payload;

  const phoneNumber = await Buyer.findOne({ phone });
  if (phoneNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already exists');
  }

  const LoggeUser = await User.findById({ _id: userId });
  // console.log(LoggeUser);

  if (!LoggeUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
  }

  const SalesManName = LoggeUser?.name;

  const data = { createdBy: SalesManName, ...payload };

  const result = await Buyer.create(data);
  return result;
};

const getAllBuyersFromDb = async ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const BuyerSearchableFileds = ['name', 'phone', 'adress', 'createdBy'];

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
const getBySalseManNameFromDb = async (payload: string) => {
  const result = await Buyer.find({
    createdBy: payload,
    isDeleted: false,
  }).sort({
    createdAt: -1,
  });
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
  userId: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paidAmount } = payload;

    const LoggeUser = await User.findById({ _id: userId });
    console.log(LoggeUser);

    if (!LoggeUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
    }

    const SalesManName = LoggeUser?.name;

    const buyer = await Buyer.findById({ _id: id, isDeleted: false }).session(
      session,
    );

    // console.log(buyer);
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
    // buyer.totalDue = Math.max(0, (buyer.totalDue ?? 0) - paidAmount);
    // buyer.totalPay = Math.max(0, (buyer.totalPay ?? 0) + paidAmount);

    // buyer.paymentHistory.push({
    //   amount: paidAmount,
    //   reviceBy: SalesManName,
    //   date: new Date(),
    // });

    // await buyer.save({ session });

    await Buyer.findByIdAndUpdate(
      id,
      {
        $set: {
          totalDue: Math.max(0, (buyer.totalDue ?? 0) - paidAmount),
          totalPay: Math.max(0, (buyer.totalPay ?? 0) + paidAmount),
        },
        $push: {
          paymentHistory: {
            amount: paidAmount,
            reviceBy: SalesManName,
            date: new Date(),
          },
        },
      },
      { session, new: true, runValidators: true },
    );

    // Find and update related stock out records
    const stockOutRecords = await StockOut.find({
      buyerName: id,
      isDeleted: false,
      dueAmount: { $gt: 0 },
    })
      .sort({ createdAt: 1 })
      .session(session);

    // console.log(stockOutRecords);

    const salesmanId =
      stockOutRecords.length > 0 ? stockOutRecords[0].salesman : null;
    // const salesman = salesmanId
    //   ? await User.findById(salesmanId).session(session)
    //   : null;
    // if (salesman) {
    //   salesman.totalSalesDue = Math.max(
    //     0,
    //     (salesman.totalSalesDue ?? 0) - paidAmount,
    //   );
    //   await salesman.save({ session });
    // }

    if (salesmanId) {
      await User.findByIdAndUpdate(
        salesmanId,
        {
          $inc: { totalSalesDue: -paidAmount }, // Decrease totalSalesDue by paidAmount
        },
        { session, new: true }, // Use the session and return the updated document
      );
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          dueCollectionHistory: {
            buyerName: buyer.name,
            date: new Date(),
            collectedAmount: paidAmount,
          },
        },
      },
      { session, new: true },
    );

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
  getBySalseManNameFromDb,
  updateBuyerDueAmountFromDb,
};
