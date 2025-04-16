import { model, Schema } from 'mongoose';
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
    price: { type: Number, required: true },
    /* The `quantity` field in the `stockInSchema` is defining the number of units of a product that
    are being added to the stock. It is of type Number and is marked as required, indicating that
    every stock entry must have a specified quantity value. This field helps in tracking the amount
    of a particular product that is being received in each stock-in transaction. */
    quantity: { type: Number, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    vehicleNumber: { type: String },
    supplierName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StockIn = model<TStockIn>('StockIn', stockInSchema);
