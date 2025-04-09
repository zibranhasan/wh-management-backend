import { model, Schema } from 'mongoose';
import { TProduct, TStockIn } from './inStock.interface';

const productSchema = new Schema<TProduct>({
  productName: { type: String, required: true },
  productQuantity: { type: Number, required: true },
  productPrice: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

const stockInSchema = new Schema<TStockIn>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    vehicleNumber: { type: String },
    supplierName: { type: String, required: true },
    products: [productSchema],
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StockIn = model<TStockIn>('StockIn', stockInSchema);
