import { model, Schema } from 'mongoose';
import { Texpense } from './expense.interface';

const expensSchema = new Schema<Texpense>({
  name: {
    type: String,
    required: [true, 'Name is reuried '],
  },
  amount: { type: Number, required: [true, 'Amount is reuired '] },

  date: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

export const Expense = model<Texpense>('Expense', expensSchema);
