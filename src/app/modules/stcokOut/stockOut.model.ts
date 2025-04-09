import { model, Schema } from 'mongoose';
import { ToutStock } from './stockOut.interface';

const stockOutSchema = new Schema<ToutStock>({
  date: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: Schema.Types.ObjectId,
    ref: 'StockIn',
    required: true,
  },

  quantity: { type: Number, required: true },
  buyerName: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
  salesman: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

export const StockOut = model('StockOut', stockOutSchema);
