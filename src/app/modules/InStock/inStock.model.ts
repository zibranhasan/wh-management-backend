import { model, Schema } from 'mongoose';
import { Splier } from '../splier/spiler.model';
import { TStockIn } from './inStock.interface';

const stockInSchema = new Schema<TStockIn>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters.'],
    },
    unit: {
      type: String,
      required: true,
      enum: {
        values: ['kg', 'liter', 'pcs', 'box'],
        message: "unit value can't be {VALUE}, must be kg/liter/pcs/bag",
      },
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    damageQuantity: { type: Number, default: 0 },
    invoiceNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    productType: {
      type: String,
      required: true,
      enum: {
        values: ['dubai', 'container'],
        message: 'dubai or container',
      },
    },
    supplierName: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Splier,
    },
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StockIn = model<TStockIn>('StockIn', stockInSchema);
