import { ObjectId } from 'mongoose';

export type TProduct = {
  name: string;
  // unit: string;
  description: string;
  isDeleted?: boolean;
  date?: Date;
};

export type TStockIn = {
  productId: ObjectId;
  name: string;
  quantity: number;
  price: number;
  invoiceNumber: string;
  vehicleNumber: string;
  productType: 'international' | 'local';
  supplierName: ObjectId;
  date?: Date;
  unit: 'kg' | 'pcs' | 'liter' | 'box';
  isDeleted?: boolean;
};
