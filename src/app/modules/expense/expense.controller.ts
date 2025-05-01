import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { expenseService } from './expense.service';
const createExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await expenseService.createExpenseIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Create successfully',
    data: result,
  });
});

const getAllExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await expenseService.getAllExpenseFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Get successfully',
    data: result,
  });
});

const deletedExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const result = await expenseService.DeleteExpenseFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Deleted successfully',
    data: result,
  });
});

export const expenseController = {
  createExpense,
  getAllExpense,
  deletedExpense,
};
