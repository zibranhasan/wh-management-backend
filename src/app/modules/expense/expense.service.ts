/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expense } from './expense.model';

const createExpenseIntoDb = async (payload: any) => {
  const result = await Expense.create(payload);

  return result;
};
const getAllExpenseFromDb = async () => {
  const result = await Expense.find({ isDeleted: false });

  return result;
};
const DeleteExpenseFromDb = async (id: string) => {
  const result = await Expense.findByIdAndUpdate({
    _id: id,
    isDeleted: true,
    new: true,
  });

  return result;
};

export const expenseService = {
  createExpenseIntoDb,
  getAllExpenseFromDb,
  DeleteExpenseFromDb,
};
