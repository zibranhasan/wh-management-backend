/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Buyer } from '../Buyer/buyer.model';
import { StockIn } from '../InStock/inStock.model';
import { User } from '../User/user.model';
import { ToutStock } from './stockOut.interface';
import { StockOut } from './stockOut.model';

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
    const {
      product,
      paidAmount = 0,
      quantity,
      buyerPhone,
      sellingPrice,
      discount = 0,
    } = payload;
    // console.log(name, 'dd');
    const Product = await StockIn.findOne({ _id: product });
    if (!Product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // console.log(Product);

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

    const LoggeUser = await User.findById({ _id: userId });
    // console.log(LoggeUser);

    if (!LoggeUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const SalesManName = LoggeUser?.name;

    // const productPrice = Product?.price;

    let totalAmount = sellingPrice * quantity;
    let dueAmount = totalAmount - paidAmount;

    if (totalAmount < paidAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You paid under total amount');
    }

    if (discount > 0) {
      // const discountAmount = (totalAmount * discount) / 100;
      // const totalAmountAfterDiscount = totalAmount - discountAmount;
      // const dueAmountAfterDiscount = totalAmountAfterDiscount - paidAmount;

      // if (totalAmountAfterDiscount < paidAmount) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     'You paid under total amount after discount',
      //   );
      // }
      totalAmount = totalAmount - discount;
      dueAmount = totalAmount - paidAmount;
    }

    const result = await StockIn.updateOne(
      { _id: Product?._id },
      {
        $inc: { quantity: -quantity },
      },
      { session, new: true },
    );
    // console.log(result);

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
          invoiceNumber: Product?.invoiceNumber,
          quantity,
          sellingPrice,
          buyerName: isBuyer._id,
          buyerPhone: isBuyer.phone,
          discount,
          salesman: userId,
          dueAmount,
        },
      ],
      { session },
    );
    // console.log(outStockRecord);

    const stockOutRecodForid = outStockRecord[0];

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
            stockOutId: stockOutRecodForid._id,
          },
          paymentHistory: {
            amount: paidAmount,
            date: new Date(),
            reviceBy: SalesManName,
            stockOutId: stockOutRecodForid._id,
          },
        },
      },
      { session, new: true },
    );

    if (!buyerUpdate) {
      throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found');
    }
    const updateSalseman = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalSale: totalAmount,
          totalSalesDue: dueAmount,
        },
      },
      { session, new: true },
    );

    if (!updateSalseman) {
      throw new AppError(httpStatus.NOT_FOUND, 'Salsman not found');
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
  const StcokSearchableFileds = ['productName'];

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
  // Get optional days parameter (default to 30 if not provided)
  const days = req.query.days ? Number.parseInt(req.query.days as string) : 30;

  // Calculate date X days ago from today
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0); // Start of the day

  // Get current date (end of today)
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of today

  // console.log(
  //   `Fetching sales data from ${startDate.toISOString()} to ${endDate.toISOString()}`,
  // );

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

// const deletedSingleStcokOutFromDb = async (id: string) => {
//   const result = await StockOut.findByIdAndUpdate(
//     id,
//     {
//       isDeleted: true,
//     },
//     { new: true },
//   );
//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
//   }
//   return result;
// };

const deletedSingleStcokOutFromDb = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the StockOut record
    const stockOut = await StockOut.findById(id).session(session);
    if (!stockOut || stockOut.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
    }

    // 2. Mark StockOut as deleted
    stockOut.isDeleted = true;
    await stockOut.save({ session });

    // 3. Restore quantity in StockIn
    await StockIn.findByIdAndUpdate(
      stockOut.product,
      { $inc: { quantity: stockOut.quantity } },
      { session },
    );

    // 4. Update Buyer totals and remove product/payment history
    await Buyer.findByIdAndUpdate(
      stockOut.buyerName,
      {
        $inc: {
          totalPurchase: -(stockOut.totalAmount ?? 0),
          totalDue: -(stockOut.dueAmount ?? 0),
          totalPay: -(stockOut.paidAmount ?? 0),
        },
        $pull: {
          products: {
            // orderDate: { $eq: new Date(stockOut.date) },

            stockOutId: stockOut._id,
          },
          paymentHistory: {
            // date: { $eq: new Date(stockOut.date) },
            stockOutId: stockOut._id,
          },
        },
      },
      { session },
    );

    // 5. Update Salesman totals
    await User.findByIdAndUpdate(
      stockOut.salesman,
      {
        $inc: {
          totalSale: -(stockOut.totalAmount ?? 0),
          totalSalesDue: -(stockOut.dueAmount ?? 0),
        },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return stockOut;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
const getSingleStockOutBySellsmanIntodb = async (id: string) => {
  const result = await StockOut.find({ salesman: id, isDeleted: false })
    .populate('buyerName')
    .populate('salesman');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No OutStock found');
  }
  return result;
};

const getAllProfitsGroupedByInvoice = async () => {
  const result = await StockOut.aggregate([
    {
      $match: {
        isDeleted: false, // Only include non-deleted records
      },
    },
    {
      $lookup: {
        from: 'stockins', // Join with the StockIn collection
        localField: 'product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails', // Unwind the product details array
    },
    {
      $group: {
        _id: '$invoiceNumber',

        products: {
          $push: {
            productName: '$productName',
            quantity: '$quantity',
            sellingPrice: '$sellingPrice',
            buyingPrice: '$productDetails.price',
            profit: {
              $multiply: [
                { $subtract: ['$sellingPrice', '$productDetails.price'] },
                '$quantity',
              ],
            },
          },
        },

        totalProfit: {
          $sum: {
            $multiply: [
              { $subtract: ['$sellingPrice', '$productDetails.price'] },
              '$quantity',
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        productName: '$productName',
        invoiceNumber: '$_id',
        products: 1,
        totalProfit: 1,
      },
    },
    {
      $sort: { invoiceNumber: 1 }, // Sort by invoice number
    },
  ]);

  return result;
};

export const StcokOutService = {
  getAllProfitsGroupedByInvoice,
  CreateStockOutIntoDb,
  getAllStcokOutFromDb,
  deletedSingleStcokOutFromDb,
  getLast30DaysSalesFromDb,
  getSingleStockOutIntoDb,
  getSingleStockOutBySellsmanIntodb,
};
