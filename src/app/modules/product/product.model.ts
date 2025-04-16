import { model, Schema } from 'mongoose';
import { TProduct } from '../InStock/inStock.interface';

const productSchema = new Schema<TProduct>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [3, 'Name must be at least 3 characters.'],
  },

  date: {
    type: Date,
    default: Date.now,
  },
  isDeleted: { type: Boolean, default: false },
});
export const Product = model<TProduct>('Product', productSchema);
