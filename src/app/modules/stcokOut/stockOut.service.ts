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
    const { name, paidAmount = 0, quantity, buyerPhone } = payload;
    console.log(name, 'dd');
    const product = await StockIn.findOne({ _id: name });
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    console.log(product);

    if (product.quantity < quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Not enough quantity in stock',
      );
    }
    const isBuyer = await Buyer.findOne({ phone: buyerPhone });

    if (!isBuyer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Buyer Not Founded');
    }

    const productPrice = product?.price;

    const totalAmount = productPrice * quantity;
    const dueAmount = totalAmount - paidAmount;

    const result = await StockIn.updateOne(
      { _id: product?._id },
      {
        $inc: { quantity: -quantity },
      },
      { session },
    );
    console.log(result);

    if (result.modifiedCount === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update product quantity',
      );
    }

    const outStockRecord = await StockOut.create(
      [
        {
          product: name,
          paidAmount,
          totalAmount,
          productName: product?.name,
          quantity,
          buyerName: isBuyer._id,
          buyerPhone: isBuyer.phone,
          salesman: '67f39d2e47e09dc04b79942a',
          dueAmount,
        },
      ],
      { session },
    );

    const buyerUpdate = await Buyer.findByIdAndUpdate(
      isBuyer._id,
      {
        $inc: { totalPurchase: totalAmount, totalDue: dueAmount },
        $push: {
          products: {
            productId: product._id,
            productName: product.name,
            quantity,
            orderDate: new Date(),
          },
        },
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
