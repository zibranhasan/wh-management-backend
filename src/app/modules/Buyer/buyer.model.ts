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
  address: { type: String },
  totalPurchase: { type: Number, default: 0 },
  totalDue: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

export const Buyer = model<TBuyer>('Buyer', buyerSchema);
