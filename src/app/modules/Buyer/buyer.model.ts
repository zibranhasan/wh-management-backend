import { model, Schema } from 'mongoose';
import { TBuyer } from './buyer.interface';

const buyerSchema = new Schema<TBuyer>({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
    unique: true,
  },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'StockIn.products' },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      orderDate: { type: Date, default: Date.now },
      stockOutId: { type: String, required: true },
    },
  ],
  totalPay: { type: Number, required: true, default: 0 },
  address: { type: String },
  paymentHistory: [
    {
      amount: { type: Number, required: true, default: 0 },
      date: { type: Date, default: Date.now },
      reviceBy: { type: String, required: true },
      stockOutId: { type: String, required: true },
    },
  ],
  createdBy: { type: String, required: true },
  totalPurchase: { type: Number, default: 0 },
  totalDue: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

export const Buyer = model<TBuyer>('Buyer', buyerSchema);
