import { model, Schema } from 'mongoose';
import { ToutStock } from './stockOut.interface';

const stockOutSchema = new Schema<ToutStock>({
  date: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'StockIn',
    required: true,
  },
  productName: { type: String, requied: true },
  quantity: { type: Number, required: true },
  buyerName: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
  buyerPhone: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  salesman: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

export const StockOut = model('StockOut', stockOutSchema);
