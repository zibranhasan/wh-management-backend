import { ObjectId } from 'mongoose';

export type ToutStock = {
  date?: Date;
  products: ObjectId;
  paidAmount?: number;
  totalAmount: number;
  quantity: number;
  buyerName: ObjectId;
  salesman: ObjectId;
  dueAmount?: number;
};
