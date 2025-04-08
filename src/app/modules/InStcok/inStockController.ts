import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { inStcokService } from './inStcok.service';
const createInStcok = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body, 'body');
  const result = await inStcokService.CreateInStockIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stcok Create successfully',
    data: result,
  });
});

const getAllInStcok = catchAsync(async (req: Request, res: Response) => {
  const result = await inStcokService.getAllInStockFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stcok Get successfully',
    data: result,
  });
});

const deleteProductFromStockIn = catchAsync(
  async (req: Request, res: Response) => {
    const { stockInId, productId } = req.params;
    const result = await inStcokService.deleteProductStockInFromDb(
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

export const inStcokController = {
  createInStcok,
  getAllInStcok,
  deleteProductFromStockIn,
};
