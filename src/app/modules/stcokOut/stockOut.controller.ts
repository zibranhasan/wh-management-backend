import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { StcokOutService } from './stockOut.service';
const createstockOut = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  console.log(userId);
  const result = await StcokOutService.CreateStockOutIntoDb(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Create outStock successfully',
    data: result,
  });
});

const getAllstockOut = catchAsync(async (req: Request, res: Response) => {
  const result = await StcokOutService.getAllStcokOutFromDb({
    query: req.query,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OutStock retrieved successfully',
    data: result,
  });
});
const getLast30DaysSales = catchAsync(async (req: Request, res: Response) => {
  const result = await StcokOutService.getLast30DaysSalesFromDb(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OutStock retrieved successfully',
    data: result,
  });
});

const deletedSingleStockOut = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StcokOutService.deletedSingleStcokOutFromDb(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OutStock deleted successfully',
      data: result,
    });
  },
);
const getSingleStockOut = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StcokOutService.getSingleStockOutIntoDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OutStock revertive successfully',
    data: result,
  });
});

export const stcokOutController = {
  createstockOut,
  getAllstockOut,
  deletedSingleStockOut,
  getLast30DaysSales,
  getSingleStockOut,
};
