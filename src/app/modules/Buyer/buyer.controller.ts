import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import { buyerService } from './buyer.service';

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
  const result = await buyerService.getAllBuyersFromDb({ query: req.query });
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
const deleteBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await buyerService.deleteBuyerFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer deleted successfully',
    data: result,
  });
});

const updateBuyerDueAmount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { userId } = req.user;
  // console.log(userId);

  const result = await buyerService.updateBuyerDueAmountFromDb(
    id,
    req.body,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Due Amount Updated successfully',
    data: result,
  });
});

export const buyerController = {
  createBuyer,
  getAllBuyers,
  getSingleBuyer,
  deleteBuyer,
  updateBuyerDueAmount,
};
