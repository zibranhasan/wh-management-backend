import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productQuantity: { type: Number, required: true },
  productPrice: { type: Number, required: true },
});

const stockInSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true },
    vehicleNumber: { type: String },
    supplierName: { type: String, required: true },
    products: [productSchema],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const StockIn = mongoose.model('StockIn', stockInSchema);
