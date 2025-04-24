import { StockIn } from './inStock.model';
import { TStockIn } from './inStock.interface';
import { Product } from '../product/product.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { StockOut } from '../stcokOut/stockOut.model';

const CreateInStockIntoDb = async (data: TStockIn) => {
  // Find the product by ID
  const product = await Product.findById(data.productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Set the product name in the stock data
  const stockData = {
    ...data,
    name: product.name,
  };

  const result = await StockIn.create(stockData);
  return result;
};

const getAllInStockFromDb = async () => {
  const result = await StockIn.find({ isDeleted: false }).sort({
    createdAt: -1,
  });

  return result;
};
const getStcokAlertFromDb = async () => {
  const result = await StockIn.find({
    $and: [{ quantity: { $lt: 70 } }, { isDeleted: { $eq: false } }],
  });

  return result;
};
const getDashboardStatsIntoDb = async () => {
  const totalSalesResult = await StockOut.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,

        totalAmout: { $sum: '$totalAmount' },
      },
    },
  ]);
  const totalDueResult = await StockOut.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,

        dueAmount: { $sum: '$dueAmount' },
      },
    },
  ]);
  const TotalDues = totalDueResult.length > 0 ? totalDueResult[0].dueAmount : 0;

  const totalValueResult = await StockIn.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,

        totalValue: {
          $sum: { $multiply: ['$quantity', '$price'] },
        },
      },
    },
  ]);

  // console.log(totalSalesResult);
  const totalValueNet =
    totalValueResult.length > 0 ? totalValueResult[0].totalValue : 0;

  // console.log(totalSalesResult);
  const totalSales =
    totalSalesResult.length > 0 ? totalSalesResult[0].totalAmout : 0;

  console.log(TotalDues);
  return {
    TotalSales: totalSales,
    TotalDue: TotalDues,
    TotalNet: totalValueNet,
  };
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
  getDashboardStatsIntoDb,
  getStcokAlertFromDb,
};
