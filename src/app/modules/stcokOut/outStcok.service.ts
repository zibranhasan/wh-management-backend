/* eslint-disable @typescript-eslint/no-unused-vars */
import { ToutStock } from './outStock.interface';
import { StockIn } from '../InStcok/inStock.model';
import { StockOut } from './outStock.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
const CreateOutStockIntoDb = async (payload: ToutStock) => {
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
  );

  if (!product || !product.products || product.products.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const productPrice = product.products[0].productPrice;

  //
  const totalAmount = productPrice * quantity;
  const dueAmount = totalAmount - paidAmount;

  const result = await StockIn.updateOne(
    { 'products._id': products },
    {
      $inc: { 'products.$.productQuantity': -quantity },
    },
    { new: true },
  );

  const outStockRecord = await StockOut.create({
    date,
    products,
    paidAmount,
    totalAmount,
    quantity,
    buyerName,
    salesman,
    dueAmount,
  });

  return outStockRecord;
};

const getAllOutStcokFromDb = async () => {
  const result = await StockOut.find({})

    .populate('buyerName')
    .populate('salesman')

    .sort({ createdAt: -1 });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
  }

  return result;
};

export const outStcokService = {
  CreateOutStockIntoDb,
  getAllOutStcokFromDb,
};
