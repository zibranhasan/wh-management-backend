import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import { buyerService } from './buyer.service';
import { TBuyer } from './buyer.interface';
const createBuyer = catchAsync(async (req: Request, res: Response) => {
  const result = await buyerService.createBuyerIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer registered successfully',
    data: result,
  });
});

const getAllBuyers = catchAsync(async (req: Request, res: Response) => {
  const result = await buyerService.getAllBuyersFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyers retrieved successfully',
    data: result,
  });
});

const getSingleBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await buyerService.getSingleBugerFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer retrieved successfully',
    data: result,
  });
});

export const buyerController = {
  createBuyer,
  getAllBuyers,
  getSingleBuyer,
};
