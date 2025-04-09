import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { inStockService } from './inStcok.service';
const createInStock = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body, 'body');
  const result = await inStockService.CreateInStockIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stcok Create successfully',
    data: result,
  });
});

const getAllInStock = catchAsync(async (req: Request, res: Response) => {
  const result = await inStockService.getAllInStockFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stcok Get successfully',
    data: result,
  });
});

const updateInStock = catchAsync(async (req: Request, res: Response) => {
  const { stockInId } = req.params;

  const updateData = req.body;
  const result = await inStockService.updateStockInIntoDb(
    stockInId,
    updateData,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const updateProductInStock = catchAsync(async (req: Request, res: Response) => {
  const { stockInId, productId } = req.params;
  // console.log(req.params, 'params');
  const result = await inStockService.updateProductInStockIntoDb(
    stockInId,
    productId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Update successfully',
    data: result,
  });
});

const deleteProductFromStockIn = catchAsync(
  async (req: Request, res: Response) => {
    const { stockInId, productId } = req.params;
    const result = await inStockService.deleteProductStockInFromDb(
      stockInId,
      productId,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product deleted successfully',
      data: result,
    });
  },
);

export const inStockController = {
  createInStock,
  getAllInStock,
  deleteProductFromStockIn,
  updateInStock,
  updateProductInStock,
};
