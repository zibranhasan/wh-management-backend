import { ObjectId } from 'mongoose';

export type TProduct = {
  name: string;
  unit: string;
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
  supplierName: string;
  date?: Date;
  isDeleted?: boolean;
};
