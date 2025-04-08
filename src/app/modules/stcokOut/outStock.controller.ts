import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { outStcokService } from './outStcok.service';
const createOutStcok = catchAsync(async (req: Request, res: Response) => {
  const result = await outStcokService.CreateOutStockIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const getAllOutStcok = catchAsync(async (req: Request, res: Response) => {
  const result = await outStcokService.getAllOutStcokFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OutStock retrieved successfully',
    data: result,
  });
});

export const outStcokController = {
  createOutStcok,
  getAllOutStcok,
};
