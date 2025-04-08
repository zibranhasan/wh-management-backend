import { model, Schema } from 'mongoose';
import { ToutStock } from './outStock.interface';
import { Buyer } from '../Buyer/buyer.model';
import { StockIn } from '../InStcok/inStock.model';
const stockOutSchema = new Schema<ToutStock>({
  date: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: Schema.Types.ObjectId,
    ref: 'StockIn', // If you're referencing embedded products
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
  dueAmount: Number,
});

export const StockOut = model('StockOut', stockOutSchema);
