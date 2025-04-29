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
  // unit: {
  //   type: String,
  //   required: true,
  //   enum: {
  //     values: ['kg', 'litre', 'pcs', 'bag'],
  //     message: "unit value can't be {VALUE}, must be kg/litre/pcs/bag",
  //   },
  // },

  description: {
    type: String,
    required: true,
    minLength: [5, 'description must be 5 charactes'],
  },

  date: {
    type: Date,
    default: Date.now,
  },
  isDeleted: { type: Boolean, default: false },
});
export const Product = model<TProduct>('Product', productSchema);
