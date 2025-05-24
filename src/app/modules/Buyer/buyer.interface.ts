export type TBuyer = {
  name: string;
  phone: string;
  address: string;
  products: [];
  totalPurchase?: number;
  totalDue?: number;
  createdBy?: string;
  paymentHistory?: {
    amount: number;
    date: Date;
    reviceBy: string;
    stockOutId: string;
  }[];
  date?: Date;
  totalPay?: number;
  isDeleted?: boolean;
};
