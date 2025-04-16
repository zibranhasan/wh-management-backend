import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { productService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.createProductIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Create successfully',
    data: result,
  });
});
const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProductFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Create successfully',
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProduct,
};
