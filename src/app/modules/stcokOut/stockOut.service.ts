 
import { ToutStock } from './stockOut.interface';
import { StockIn } from '../InStock/inStock.model';
import { StockOut } from './stockOut.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Buyer } from '../Buyer/buyer.model';
import mongoose from 'mongoose';

/**
 * The function `CreateStockOutIntoDb` handles the process of updating stock quantities, creating stock
 * out records, and updating buyer information in a database transaction.
 * @param {ToutStock} payload - The `CreateStockOutIntoDb` function is responsible for creating a stock
 * out record in the database based on the provided payload. The payload should contain the following
 * properties:
 * @returns The function `CreateStockOutIntoDb` is returning the `outStockRecord` which represents the
 * record of the stock out transaction that was created in the database.
 */
const CreateStockOutIntoDb = async (payload: ToutStock) => {
  const session = await mongoose.startSession(); // Start a session for the transaction
  session.startTransaction(); // Start the transaction

  try {
    const {
      date,
      products,
      paidAmount = 0,
      quantity,
      buyerName,
      salesman,
    } = payload;

    const product = await StockIn.findOne(
      { 'products._id': products },
      { 'products.$': 1 },
      { session },
    );

    if (!product || !product.products || product.products.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const productPrice = product.products[0].productPrice;

    const totalAmount = productPrice * quantity;
    const dueAmount = totalAmount - paidAmount;

    const result = await StockIn.updateOne(
      { 'products._id': products },
      {
        $inc: { 'products.$.productQuantity': -quantity },
      },
      { session }, // Pass the session
    );

    if (result.modifiedCount === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update product quantity',
      );
    }

    const outStockRecord = await StockOut.create(
      [
        {
          date,
          products,
          paidAmount,
          totalAmount,
          quantity,
          buyerName,
          salesman,
          dueAmount,
        },
      ],
      { session },
    );

    /* The code snippet `const buyerUpdate = await Buyer.findByIdAndUpdate(buyerName, { : {
  totalPurchase: totalAmount, totalDue: dueAmount } }, { session, new: true });` is updating the
  buyer's information in the database. */

    const buyerUpdate = await Buyer.findByIdAndUpdate(
      buyerName,
      {
        $inc: { totalPurchase: totalAmount, totalDue: dueAmount },
      },
      { session, new: true },
    );

    if (!buyerUpdate) {
      throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
    }

    await session.commitTransaction();
    session.endSession();

    return outStockRecord;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllStcokOutFromDb = async () => {
  const result = await StockOut.find({ isDeleted: false })

    .populate('buyerName')
    .populate('salesman')

    .sort({ createdAt: -1 });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
  }

  return result;
};

const deletedSingleStcokOutFromDb = async (id: string) => {
  const result = await StockOut.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
  }
  return result;
};

export const StcokOutService = {
  CreateStockOutIntoDb,
  getAllStcokOutFromDb,
  deletedSingleStcokOutFromDb,
};
