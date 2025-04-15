import { StockIn } from './inStock.model';
import { TStockIn } from './inStock.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const CreateInStockIntoDb = async (data: TStockIn) => {
  console.log(data, 'data');
  const result = await StockIn.create(data);
  return result;
};

const getAllInStockFromDb = async () => {
  const result = await StockIn.find({ isDeleted: false }).sort({
    createdAt: -1,
  });

  return result;
};

const deleteProductStockInFromDb = async (
  stockInId: string,
  productId: string,
) => {
  const result = await StockIn.findOneAndUpdate(
    {
      _id: stockInId,
      'products._id': productId,
    },
    {
      $set: { 'products.$.isDeleted': true },
    },
    { new: true },
  );
  return result;
};

const updateStockInIntoDb = async (
  stockInId: string,
  updateData: Partial<TStockIn>,
) => {
  const result = await StockIn.findOneAndUpdate(
    { _id: stockInId },
    { $set: updateData },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'StockIn document not found');
  }

  return result;
};
const deleteStockInIntoDb = async (stockInId: string) => {
  const result = await StockIn.findByIdAndUpdate(
    { _id: stockInId },
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'StockIn document not found');
  }

  return result;
};

const updateProductInStockIntoDb = async (
  stockInId: string,
  productId: string,
  updateData: Partial<{
    productName: string;
    productQuantity: number;
    productPrice: number;
  }>,
) => {
  const modifiedData: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updateData)) {
    modifiedData[`products.$.${key}`] = value;
  }

  const result = await StockIn.findOneAndUpdate(
    {
      _id: stockInId,
      'products._id': productId,
    },
    {
      $set: modifiedData,
    },
    { new: true },
  );

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product or StockIn document not found',
    );
  }

  return result;
};

export const inStockService = {
  CreateInStockIntoDb,
  deleteProductStockInFromDb,
  getAllInStockFromDb,
  updateStockInIntoDb,
  updateProductInStockIntoDb,
  deleteStockInIntoDb,
};
