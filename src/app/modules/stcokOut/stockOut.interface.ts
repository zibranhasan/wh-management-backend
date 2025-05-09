import { ObjectId } from 'mongoose';

export type ToutStock = {
  date?: Date;
  buyerPhone: string;
  product: ObjectId;
  paidAmount?: number;
  totalAmount: number;
  productName: string;
  quantity: number;
  buyerName: ObjectId;
  discount?: number;
  salesman: ObjectId;
  sellingPrice: number;
  invoiceNumber: string;
  dueAmount?: number;
  isDeleted?: boolean;
};
