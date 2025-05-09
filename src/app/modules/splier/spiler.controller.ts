import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { splierService } from './splier.service';
const createSplier = catchAsync(async (req: Request, res: Response) => {
  const result = await splierService.createSplierIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supplier Create successfully',
    data: result,
  });
});
const getAllSplier = catchAsync(async (req: Request, res: Response) => {
  const result = await splierService.getAllSplierIntoDb({ query: req.query });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supplier Create successfully',
    data: result,
  });
});
const getSingelSplier = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await splierService.getSingelSplierIntoDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supplier Create successfully',
    data: result,
  });
});
const deleteSingelSplier = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await splierService.deleteSingelSplier(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supplier Create successfully',
    data: result,
  });
});
const updateSingelSplier = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await splierService.UpdateSingelSplierIntoDb(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supplier Create successfully',
    data: result,
  });
});

export const splierController = {
  createSplier,
  getAllSplier,
  getSingelSplier,
  deleteSingelSplier,
  updateSingelSplier,
};
