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
  salesman: ObjectId;
  dueAmount?: number;
  isDeleted?: boolean;
};
