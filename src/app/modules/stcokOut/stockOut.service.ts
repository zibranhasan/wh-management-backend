/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToutStock } from './stockOut.interface';
import { StockIn } from '../InStock/inStock.model';
import { StockOut } from './stockOut.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Buyer } from '../Buyer/buyer.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

/**
 * The function `CreateStockOutIntoDb` handles the process of updating stock quantities, creating stock
 * out records, and updating buyer information in a database transaction.
 * @param {ToutStock} payload - The `CreateStockOutIntoDb` function is responsible for creating a stock
 * out record in the database based on the provided payload. The payload should contain the following
 * properties:
 * @returns The function `CreateStockOutIntoDb` is returning the `outStockRecord` which represents the
 * record of the stock out transaction that was created in the database.
 */
const CreateStockOutIntoDb = async (payload: ToutStock, userId: string) => {
  const session = await mongoose.startSession(); // Start a session for the transaction
  session.startTransaction(); // Start the transaction

  try {
    const { product, paidAmount = 0, quantity, buyerPhone } = payload;
    // console.log(name, 'dd');
    const Product = await StockIn.findOne({ _id: product });
    if (!Product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    console.log(product);

    if (!Product || Product.quantity < quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Not enough quantity in stock',
      );
    }
    const isBuyer = await Buyer.findOne({ phone: buyerPhone });

    if (!isBuyer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Buyer Not Founded');
    }

    const productPrice = Product?.price;

    const totalAmount = productPrice * quantity;
    const dueAmount = totalAmount - paidAmount;

    const result = await StockIn.updateOne(
      { _id: Product?._id },
      {
        $inc: { quantity: -quantity },
      },
      { session, new: true },
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
          product,
          paidAmount,
          totalAmount,
          productName: Product?.name,
          quantity,
          buyerName: isBuyer._id,
          buyerPhone: isBuyer.phone,
          salesman: userId,
          dueAmount,
        },
      ],
      { session },
    );

    const buyerUpdate = await Buyer.findByIdAndUpdate(
      isBuyer._id,
      {
        $inc: {
          totalPurchase: totalAmount,
          totalDue: dueAmount,
          totalPay: paidAmount,
        },
        $push: {
          products: {
            productId: Product._id,
            productName: Product.name,
            quantity,
            orderDate: new Date(),
          },
          paymentHistory: {
            amount: paidAmount,
            date: new Date(),
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

const getAllStcokOutFromDb = async ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const StcokSearchableFileds = [
    'buyerName',
    'salesman',
    'buyerPhone',
    'productName',
  ];

  const StcokQuery = new QueryBuilder(
    StockOut.find({ isDeleted: false })
      .populate('buyerName')
      .populate('salesman'),
    query,
  )
    .search(StcokSearchableFileds)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await StcokQuery.countTotal();
  const result = await StcokQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getLast30DaysSalesFromDb = async (req: any) => {
  // const thirtyDaysAgo = new Date();
  // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  // thirtyDaysAgo.setHours(0, 0, 0, 0);

  // console.log(thirtyDaysAgo);

  // const today = new Date();
  // today.setHours(23, 59, 59, 999);

  // // Aggregate sales data for the last 30 days
  // const dailySales = await StockOut.aggregate([
  //   {
  //     $match: {
  //       isDeleted: false,
  //       date: { $gte: thirtyDaysAgo, $lte: today },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
  //       totalAmount: { $sum: '$totalAmount' },
  //       totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
  //       count: { $sum: 1 }, // Number of transactions
  //     },
  //   },
  //   // { $sort: { _id: 1 } }, // Sort by date ascending
  // ]);

  // console.log(dailySales, 'dfsdf');

  // const last30Days = [];
  // for (let i = 0; i < 30; i++) {
  //   const date = new Date();
  //   date.setDate(date.getDate() - (29 - i));
  //   date.setHours(0, 0, 0, 0);

  //   const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  //   const salesForDay = dailySales.find((day) => day._id === dateString);
  //   console.log(salesForDay);

  //   last30Days.push({
  //     date: dateString,
  //     totalSales: salesForDay ? salesForDay?.totalAmount : 0,
  //     totalRevenue: salesForDay ? salesForDay.totalRevenue : 0,
  //     transactionCount: salesForDay ? salesForDay.count : 0,
  //   });
  // }

  // // Calculate summary statistics
  // const totalSales = last30Days.reduce((sum, day) => sum + day.totalSales, 0);
  // console.log(totalSales);
  // const totalRevenue = last30Days.reduce(
  //   (sum, day) => sum + day.totalRevenue,
  //   0,
  // );
  // const totalTransactions = last30Days.reduce(
  //   (sum, day) => sum + day.transactionCount,
  //   0,
  // );

  // // Calculate daily averages
  // const avgDailySales = totalSales / 30;
  // const avgDailyRevenue = totalRevenue / 30;
  // console.log(avgDailyRevenue);
  // console.log(avgDailySales);
  // // Find peak day
  // const peakSalesDay = [...last30Days].sort(
  //   (a, b) => b.totalSales - a.totalSales,
  // )[0];

  // Calculate date 30 days ago from today
  // const thirtyDaysAgo = new Date();
  // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  // thirtyDaysAgo.setHours(0, 0, 0, 0); // Start of the day 30 days ago

  // // Get current date (end of today)
  // const today = new Date();
  // today.setHours(23, 59, 59, 999); // End of today

  // console.log('Thirty days ago:', thirtyDaysAgo);
  // console.log('Today:', today);

  // // Aggregate sales data for the last 30 days
  // const dailySales = await StockOut.aggregate([
  //   {
  //     $match: {
  //       isDeleted: false,
  //       date: { $gte: thirtyDaysAgo, $lte: today },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
  //       totalAmount: { $sum: '$totalAmount' },
  //       totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
  //       count: { $sum: 1 }, // Number of transactions
  //     },
  //   },
  //   { $sort: { _id: 1 } }, // Sort by date ascending
  // ]);

  // console.log('Daily sales data:', dailySales);

  // // Generate a complete array of the last 30 days (including days with no sales)
  // const last30Days = [];
  // for (let i = 0; i < 30; i++) {
  //   const date = new Date();
  //   date.setDate(date.getDate() - (29 - i)); // Start from 29 days ago
  //   date.setHours(0, 0, 0, 0);

  //   const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  //   const salesForDay = dailySales.find((day) => day._id === dateString);

  //   last30Days.push({
  //     date: dateString,
  //     totalSales: salesForDay ? salesForDay.totalAmount : 0,
  //     totalRevenue: salesForDay ? salesForDay.totalRevenue : 0,
  //     transactionCount: salesForDay ? salesForDay.count : 0,
  //   });
  // }

  // // Calculate summary statistics
  // const totalSales = last30Days.reduce((sum, day) => sum + day.totalSales, 0);
  // const totalRevenue = last30Days.reduce(
  //   (sum, day) => sum + day.totalRevenue,
  //   0,
  // );
  // const totalTransactions = last30Days.reduce(
  //   (sum, day) => sum + day.transactionCount,
  //   0,
  // );

  // // Calculate daily averages
  // const avgDailySales = totalSales / 30;
  // const avgDailyRevenue = totalRevenue / 30;

  // // Find peak day
  // const peakSalesDay = [...last30Days].sort(
  //   (a, b) => b.totalSales - a.totalSales,
  // )[0];

  // Get optional days parameter (default to 30 if not provided)
  const days = req.query.days ? Number.parseInt(req.query.days as string) : 30;

  // Calculate date X days ago from today
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0); // Start of the day

  // Get current date (end of today)
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of today

  console.log(
    `Fetching sales data from ${startDate.toISOString()} to ${endDate.toISOString()}`,
  );

  // Aggregate sales data for the specified period
  const dailySales = await StockOut.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalAmount: { $sum: '$totalAmount' },
        totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
        count: { $sum: 1 }, // Number of transactions
      },
    },
    { $sort: { _id: 1 } }, // Sort by date ascending
  ]);

  // Generate a complete array of days (including days with no sales)
  const allDays = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i)); // Start from (days-1) days ago
    date.setHours(0, 0, 0, 0);

    const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const salesForDay = dailySales.find((day) => day._id === dateString);

    allDays.push({
      date: dateString,
      totalSales: salesForDay ? salesForDay.totalAmount : 0,
      totalRevenue: salesForDay ? salesForDay.totalRevenue : 0,
      transactionCount: salesForDay ? salesForDay.count : 0,
    });
  }

  // Calculate summary statistics
  const totalSales = allDays.reduce((sum, day) => sum + day.totalSales, 0);
  const totalRevenue = allDays.reduce((sum, day) => sum + day.totalRevenue, 0);
  const totalTransactions = allDays.reduce(
    (sum, day) => sum + day.transactionCount,
    0,
  );

  // Calculate daily averages
  const avgDailySales = totalSales / days;
  const avgDailyRevenue = totalRevenue / days;

  // Find peak day
  const peakSalesDay = [...allDays].sort(
    (a, b) => b.totalSales - a.totalSales,
  )[0];

  return {
    data: {
      dailyData: allDays,
      summary: {
        totalSales,
        totalRevenue,
        totalTransactions,
        avgDailySales,
        avgDailyRevenue,
        peakDay: {
          date: peakSalesDay.date,
          sales: peakSalesDay.totalSales,
          revenue: peakSalesDay.totalRevenue,
        },
      },
    },
  };
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
const getSingleStockOutIntoDb = async (id: string) => {
  const result = await StockOut.findById(id)
    .populate('buyerName')
    .populate('salesman');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
  }
  return result;
};

export const StcokOutService = {
  CreateStockOutIntoDb,
  getAllStcokOutFromDb,
  deletedSingleStcokOutFromDb,
  getLast30DaysSalesFromDb,
  getSingleStockOutIntoDb,
};
